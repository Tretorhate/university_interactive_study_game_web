import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import confetti from 'canvas-confetti'
import type { GameMeta } from '../gameMeta'
import { GameShell } from '../components/GameShell'
import { useGame, shuffle } from '../useGame'
import { sfx } from '../sfx'
import { BitTicker, Scramble } from '../ascii'
import { CheckIcon } from '../icons'

/** Группа битов с весами разрядов: [8,4,2,1] для полубайта, [128..1] для байта. */
interface Group {
  bits: string
  weights: number[]
}

type Task =
  | { kind: 'read'; groups: Group[]; out: 'dec' | 'hex'; options: string[]; answer: string; ask: string }
  | { kind: 'build'; groups: number; weights: number[]; out: 'dec' | 'hex'; target: string; targetBits: string[]; ask: string }

const W4 = [8, 4, 2, 1]
const W8 = [128, 64, 32, 16, 8, 4, 2, 1]

const hex = (v: number) => v.toString(16).toUpperCase()

/** Три различных варианта ответа вокруг правильного, в пределах [lo, hi]. */
function decDistractors(answer: number, lo: number, hi: number): string[] {
  const deltas = shuffle([1, -1, 2, -2, 3, -3, 4, -4])
  const set = new Set<number>()
  for (const d of deltas) {
    const v = answer + d
    if (v >= lo && v <= hi && set.size < 3) set.add(v)
  }
  for (let v = lo; v <= hi && set.size < 3; v++) if (v !== answer) set.add(v)
  return shuffle([...set].slice(0, 3)).map(String)
}

/** Варианты вида '5', 'B' для одиночной hex-цифры. */
function hexDistractors(answer: number): string[] {
  const cands = shuffle([answer + 1, answer - 1, answer + 2, answer - 2, answer ^ 8, answer ^ 1, answer ^ 7])
    .filter((v) => v >= 0 && v <= 15 && v !== answer)
  const set = new Set(cands.map(hex))
  set.delete(hex(answer))
  return shuffle([...set].slice(0, 3))
}

const rnd = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1))
const bin = (v: number, w: number) => v.toString(2).padStart(w, '0')

const ASK_DEC4 = ['Переведи полубайт в десятичное число', 'Прочитай код весов 8·4·2·1 — сколько получится?']
const ASK_HEX4 = [
  'Переведи полубайт в шестнадцатеричную цифру (10=A, 11=B, …)',
  'Какая hex-цифра записана этими четырьмя битами?',
]
const ASK_BYTE_HEX = ['Байт — это два полубайта. Запиши его в hex', 'Прочитай байт как две hex-цифры']
const ASK_BYTE_DEC = [
  'Переведи целый байт в десятичное число — веса уже до 128',
  'Сложи веса всех единиц байта — какое число закодировано?',
]

function generateTasks(): Task[] {
  const tasks: Task[] = []
  const pick = <T,>(arr: T[]) => arr[rnd(0, arr.length - 1)]

  for (let i = 0; i < 3; i++) {
    const v = rnd(3, 15)
    tasks.push({
      kind: 'read', out: 'dec', ask: pick(ASK_DEC4),
      groups: [{ bits: bin(v, 4), weights: W4 }],
      options: shuffle([String(v), ...decDistractors(v, 0, 15)]), answer: String(v),
    })
  }

  for (let i = 0; i < 2; i++) {
    const v = rnd(9, 15)
    tasks.push({
      kind: 'read', out: 'hex', ask: pick(ASK_HEX4),
      groups: [{ bits: bin(v, 4), weights: W4 }],
      options: shuffle([hex(v), ...hexDistractors(v)]), answer: hex(v),
    })
  }

  for (let i = 0; i < 2; i++) {
    const hi = rnd(1, 15), lo = rnd(0, 15)
    const answer = hex(hi) + hex(lo)
    const swapped = hex(lo) + hex(hi)
    const alt = decDistractors(hi, 0, 15).map((h) => h + hex(lo))[0]
    const opts = new Set([answer, swapped !== answer ? swapped : hex(hi ^ 1) + hex(lo), alt])
    while (opts.size < 4) opts.add(hex(rnd(0, 15)) + hex(rnd(0, 15)))
    opts.delete('')
    tasks.push({
      kind: 'read', out: 'hex', ask: pick(ASK_BYTE_HEX),
      groups: [{ bits: bin(hi, 4), weights: W4 }, { bits: bin(lo, 4), weights: W4 }],
      options: shuffle([...opts].slice(0, 4)), answer,
    })
  }

  for (let i = 0; i < 2; i++) {
    const v = rnd(32, 255)
    const swapped = ((v & 15) << 4) | (v >> 4)
    const extra = decDistractors(v, 0, 255).filter((d) => Number(d) !== swapped)
    tasks.push({
      kind: 'read', out: 'dec', ask: pick(ASK_BYTE_DEC),
      groups: [{ bits: bin(v, 8), weights: W8 }],
      options: shuffle([String(v), String(swapped), ...extra].slice(0, 4)), answer: String(v),
    })
  }

  for (let i = 0; i < 2; i++) {
    const v = rnd(3, 15)
    tasks.push({
      kind: 'build', out: 'dec', groups: 1, weights: W4,
      ask: `Закодируй число ${v} карточками 0 и 1 — вес каждой карточки подписан`,
      target: String(v), targetBits: [bin(v, 4)],
    })
  }

  for (let i = 0; i < 2; i++) {
    const hi = rnd(10, 15), lo = rnd(0, 15)
    tasks.push({
      kind: 'build', out: 'hex', groups: 2, weights: W4,
      ask: `Собери байт для шестнадцатеричного кода ${hex(hi)}${hex(lo)}`,
      target: `${hex(hi)}${hex(lo)}`, targetBits: [bin(hi, 4), bin(lo, 4)],
    })
  }

  return shuffle(tasks)
}

const HEX_HINT = '10=A · 11=B · 12=C · 13=D · 14=E · 15=F'

function valueOf(bits: string, weights: number[]): number {
  return [...bits].reduce((sum, b, i) => sum + (b === '1' ? weights[i] : 0), 0)
}

function BitCard({ value, weight, onToggle }: { value: string; weight: number; onToggle: () => void }) {
  return (
    <div className="bitcell">
      <motion.button
        className={`bit${value === '1' ? ' is-on' : ''}`}
        onClick={onToggle}
        whileTap={{ scale: 0.82 }}
        transition={{ type: 'spring', stiffness: 500, damping: 24 }}
      >
        {value}
      </motion.button>
      <span className="bitcell__weight">{weight}</span>
    </div>
  )
}

function BitView({ value, weight }: { value: string; weight: number }) {
  return (
    <div className="bitcell">
      <span className={`bit bit--static${value === '1' ? ' is-on' : ''}`}>{value}</span>
      <span className="bitcell__weight">{weight}</span>
    </div>
  )
}

function Board({ onDone, onMistake }: { onDone: () => void; onMistake: () => void }) {
  const [tasks] = useState<Task[]>(generateTasks)
  const [idx, setIdx] = useState(0)
  const [buildBits, setBuildBits] = useState<string[]>([])
  const [badGroups, setBadGroups] = useState<number[]>([])
  const [solved, setSolved] = useState(false)
  const [wrongPicks, setWrongPicks] = useState<string[]>([])
  const task = tasks[idx]
  const isBuild = task.kind === 'build'

  const groupCount = task.kind === 'build' ? task.groups : task.groups.length
  const bitCount = groupCount * (task.kind === 'build' ? task.weights.length : 0)
  const effectiveBits =
    isBuild && buildBits.length === bitCount ? buildBits : Array<string>(bitCount).fill('0')

  const options = useMemo(
    () => (task.kind === 'read' ? shuffle(task.options) : null),
    [task],
  )

  const advance = () => {
    if (idx + 1 >= tasks.length) onDone()
    else {
      setIdx(idx + 1)
      setBuildBits([])
      setBadGroups([])
      setWrongPicks([])
      setSolved(false)
    }
  }

  const toggleBit = (pos: number) => {
    if (solved) return
    sfx.flip()
    setBuildBits((prev) => {
      const next = [...(prev.length === bitCount ? prev : Array<string>(bitCount).fill('0'))]
      next[pos] = next[pos] === '0' ? '1' : '0'
      return next
    })
    setBadGroups([])
  }

  const buildGroups = (): Group[] => {
    if (task.kind !== 'build') return []
    const w = task.weights
    return Array.from({ length: task.groups }, (_, g) => ({
      bits: effectiveBits.slice(g * w.length, g * w.length + w.length).join(''),
      weights: w,
    }))
  }

  const formatGroup = (g: Group, out: 'dec' | 'hex') => {
    const v = valueOf(g.bits, g.weights)
    return out === 'hex' ? v.toString(16).toUpperCase() : String(v)
  }

  const checkBuild = () => {
    if (task.kind !== 'build') return
    const groups = buildGroups()
    const bad = groups.map((gr, i) => (gr.bits === task.targetBits[i] ? -1 : i)).filter((i) => i >= 0)
    if (bad.length === 0) {
      setSolved(true)
      sfx.correct()
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 }, colors: ['#ffffff', '#888888', '#333333'] })
      setTimeout(advance, 900)
    } else {
      onMistake()
      sfx.wrong()
      setBadGroups(bad)
    }
  }

  const pick = (opt: string) => {
    if (task.kind !== 'read') return
    if (opt === task.answer) {
      setSolved(true)
      sfx.correct()
      setTimeout(advance, 600)
    } else {
      onMistake()
      sfx.wrong()
      setWrongPicks((w) => [...w, opt])
    }
  }

  return (
    <>
      <div className="progressbar">
        <motion.div
          className="progressbar__fill"
          animate={{ width: `${(idx / tasks.length) * 100}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>

      <p className="hint">
        Компьютер хранит всё цепочками из 0 и 1. Каждая позиция имеет свой <strong>вес</strong> —
        сложи веса там, где стоит 1. Задание {idx + 1}/{tasks.length}
      </p>

      <div className="refstrip mono">
        <span className="refstrip__item">Веса полубайта: 8 · 4 · 2 · 1</span>
        <span className="refstrip__item">{HEX_HINT}</span>
      </div>

      <BitTicker />

      {task.kind === 'read' && (
        <div className="playcard">
          <span className="playcard__label"><Scramble key={idx} text={task.ask} speed={14} /></span>
          <div className="bitgroups">
            {task.groups.map((g, gi) => (
              <div key={gi} className={`bitgroup${solved ? ' is-good' : ''}`}>
                <div className="bitgroup__bits">
                  {[...g.bits].map((b, i) => (
                    <BitView key={i} value={b} weight={g.weights[i]} />
                  ))}
                </div>
                <span className={`bitgroup__preview${solved ? ' is-ok' : ''}`}>
                  {solved ? `= ${formatGroup(g, task.out)}` : '= ?'}
                </span>
              </div>
            ))}
          </div>
          <div className="choices choices--row">
            {options?.map((opt) => {
              const cls = solved && opt === task.answer ? ' is-correct' : wrongPicks.includes(opt) ? ' is-wrong' : ''
              return (
                <motion.button
                  key={opt}
                  className={`choice choice--letter${cls}`}
                  onClick={() => pick(opt)}
                  disabled={solved || wrongPicks.includes(opt)}
                  whileTap={{ scale: 0.97 }}
                >
                  <span>{opt}</span>
                </motion.button>
              )
            })}
          </div>
        </div>
      )}

      {task.kind === 'build' && (
        <div className="playcard">
          <span className="playcard__label"><Scramble key={idx} text={task.ask} speed={14} /></span>
          <span className="buildtarget mono">Цель: {task.target}</span>
          <div className="bitgroups">
            {buildGroups().map((g, gi) => (
              <div
                key={gi}
                className={`bitgroup${badGroups.includes(gi) ? ' is-bad' : ''}${solved ? ' is-good' : ''}`}
              >
                <div className="bitgroup__bits">
                  {[...g.bits].map((_, i) => {
                    const pos = gi * g.weights.length + i
                    return (
                      <BitCard key={i} value={effectiveBits[pos]} weight={g.weights[i]} onToggle={() => toggleBit(pos)} />
                    )
                  })}
                </div>
                <span className="bitgroup__preview">
                  {solved || badGroups.length > 0 ? `= ${formatGroup(g, task.out)}` : '= ?'}
                </span>
              </div>
            ))}
          </div>
          <span className="readout mono">
            Твой код: {solved || badGroups.length > 0 ? buildGroups().map((g) => formatGroup(g, task.out)).join('') : '??'}
          </span>
          <button className="btn btn--primary" onClick={checkBuild} disabled={solved}>
            <CheckIcon /> Проверить код
          </button>
          {badGroups.length > 0 && (
            <p className="hint hint--error">Выделенные группы не совпадают с целью — смотри на веса.</p>
          )}
        </div>
      )}
    </>
  )
}

export function BinaryLab({ meta }: { meta: GameMeta }) {
  const g = useGame(meta)
  return (
    <GameShell meta={meta} errors={g.errors} stars={g.stars} onRestart={g.restart}>
      <Board key={g.session} onDone={g.finish} onMistake={g.mistake} />
    </GameShell>
  )
}
