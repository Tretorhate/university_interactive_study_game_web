import { useEffect, useState } from 'react'
import { PauseIcon, PlayIcon, StepBackIcon, StepForwardIcon } from '../icons'
import { AnimatePresence, motion } from 'motion/react'

const TABS = ['bin → dec', 'dec → bin', 'bin → hex', 'hex → bin'] as const
const STEP_MS = 850

function Bit({ b, active, dim }: { b: string; active?: boolean; dim?: boolean }) {
  return (
    <motion.span
      className={`convbit${b === '1' ? ' is-one' : ''}${active ? ' is-active' : ''}${dim ? ' is-dim' : ''}`}
      animate={active ? { scale: [1, 1.18, 1] } : { scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {b}
    </motion.span>
  )
}

function Pop({ children, show = true, className = '' }: { children: React.ReactNode; show?: boolean; className?: string }) {
  // Элемент всегда занимает место — меняется только прозрачность. Без этого
  // появление элементов на каждом шаге дёргало бы высоту контейнера.
  return (
    <motion.span
      className={className}
      initial={false}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.25 }}
      style={{ display: 'inline-block' }}
    >
      {children}
    </motion.span>
  )
}

/** 1101 → 13: биты появляются, веса подписываются, каждый бит подсвечивается, сумма растёт. */
function DemoBinDec({ step }: { step: number }) {
  const bits = ['1', '1', '0', '1']
  const weights = [8, 4, 2, 1]
  const partial = [8, 12, 12, 13]
  const hi = step - 2
  return (
    <div className="cdstage">
      <div className="cdrow">
        {bits.map((b, i) => (
          <div key={i} className="cdcol">
            <Pop show={step >= 0}><Bit b={b} active={hi === i} dim={hi > i && b === '0'} /></Pop>
            <Pop show={step >= 1} className="cdsub">2{['³', '²', '¹', '⁰'][i]} = {weights[i]}</Pop>
            <Pop show={hi >= i} className="cdsub cdsub--result">
              {b === '1' ? `+${weights[i]}` : '+0'}
            </Pop>
          </div>
        ))}
      </div>
      <div className="cdrow cdrow--sum">
        <Pop show={hi >= 0} className="cdsum">
          сумма: {hi >= 0 && hi < 4 ? partial[hi] : 13}
        </Pop>
      </div>
      <Pop show={step >= 6} className="cdfinal">
        (1101)₂ = <b>(13)₁₀</b>
      </Pop>
    </div>
  )
}

/** 13 → 1101: строки деления появляются, остатки читаются снизу вверх. */
function DemoDecBin({ step }: { step: number }) {
  const rows: [number, number, number][] = [
    [13, 6, 1],
    [6, 3, 0],
    [3, 1, 1],
    [1, 0, 1],
  ]
  const pick = step - 4 // 0..3 — читаем снизу: строка 3-pick
  const collected = [1, 1, 0, 1].slice(0, Math.max(0, pick + 1)).join('')
  return (
    <div className="cdstage">
      <table className="convtable cddiv">
        <tbody>
          {rows.map(([n, q, r], i) => {
            const visible = step >= i
            const isPicked = pick >= 0 && i >= 3 - pick
            return (
              <tr key={i} style={{ opacity: visible ? 1 : 0.15 }}>
                <td>{n}</td>
                <td>÷ 2 = {q}</td>
                <td className={isPicked ? 'hl' : ''}>{r}</td>
                <td className="cdarrow">{i === 3 - pick && pick >= 0 ? '↑' : ''}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <Pop show={pick >= 0} className="cdsum">
        биты снизу вверх: {collected}
      </Pop>
      <Pop show={step >= 8} className="cdfinal">
        (13)₁₀ = <b>(1101)₂</b>
      </Pop>
    </div>
  )
}

/** 1101 0101 → D5: группы по 4 подсвечиваются и переводятся. */
function DemoBinHex({ step }: { step: number }) {
  const groups = ['1101', '0101']
  const dec = ['13', '5']
  const hex = ['D', '5']
  const gStep = step // 1: группа 0 → dec; 2: группа 0 → hex; 3: группа 1 → dec; 4: группа 1 → hex
  return (
    <div className="cdstage">
      <div className="cdrow">
        {groups.map((g, gi) => {
          const local = gStep - (gi * 2 + 1)
          return (
            <div key={gi} className={`cdnibble${local >= 0 ? ' is-active' : ''}`}>
              <div className="cdrow">
                {[...g].map((b, i) => <Bit key={i} b={b} />)}
              </div>
              <Pop show={local >= 0} className="cdsub">= {dec[gi]}</Pop>
              <Pop show={local >= 1} className="cdsub cdsub--result">→ {hex[gi]}</Pop>
            </div>
          )
        })}
      </div>
      <Pop show={step >= 5} className="cdfinal">
        (11010101)₂ = <b>(D5)₁₆</b>
      </Pop>
    </div>
  )
}

/** D5 → 1101 0101 и 213: цифры разворачиваются в биты, потом в десятичную. */
function DemoHexBin({ step }: { step: number }) {
  const digits = [
    { hex: 'D', bits: '1101', dec: '13' },
    { hex: '5', bits: '0101', dec: '5' },
  ]
  return (
    <div className="cdstage">
      <div className="cdrow">
        {digits.map((d, gi) => (
          <div key={gi} className="cdnibble is-active">
            <span className="cdhex">{d.hex}</span>
            <div className="cdrow">
              {[...d.bits].map((b, i) => (
                <Pop key={i} show={step >= gi + 1}>
                  <Bit b={b} />
                </Pop>
              ))}
            </div>
            <Pop show={step >= gi + 1} className="cdsub">{d.dec}·16{['¹', '⁰'][gi]}</Pop>
          </div>
        ))}
      </div>
      <Pop show={step >= 3} className="cdsum">13·16 + 5 = 208 + 5</Pop>
      <Pop show={step >= 4} className="cdfinal">
        (D5)₁₆ = <b>(213)₁₀</b>
      </Pop>
    </div>
  )
}

const MAX_STEPS = [7, 9, 6, 5]

export function ConvDemo() {
  const [tab, setTab] = useState(0)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)
  const maxStep = MAX_STEPS[tab]

  useEffect(() => {
    setStep(0)
  }, [tab])

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % maxStep), STEP_MS)
    return () => clearInterval(id)
  }, [playing, maxStep])

  const go = (delta: number) => setStep((s) => (s + delta + maxStep) % maxStep)

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    setStep(Math.round(ratio * (maxStep - 1)))
  }

  return (
    <div className="convdemo">
      <div className="convdemo__head">
        <span className="convdemo__title">Смотри, как это считается</span>
        <div className="convdemo__tabs">
          {TABS.map((t, i) => (
            <button key={t} className={`convdemo__tab${tab === i ? ' is-active' : ''}`} onClick={() => setTab(i)}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence initial={false}>
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {tab === 0 && <DemoBinDec step={step} />}
          {tab === 1 && <DemoDecBin step={step} />}
          {tab === 2 && <DemoBinHex step={step} />}
          {tab === 3 && <DemoHexBin step={step} />}
        </motion.div>
      </AnimatePresence>
      <div className="convdemo__controls">
        <button className="convdemo__btn" onClick={() => go(-1)} aria-label="Шаг назад">
          <StepBackIcon />
        </button>
        <button className="convdemo__btn" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Пауза' : 'Продолжить'}>
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button className="convdemo__btn" onClick={() => go(1)} aria-label="Шаг вперёд">
          <StepForwardIcon />
        </button>
        <div className="progressbar convdemo__seek" onClick={seek} role="slider" aria-label="Шаг анимации">
          <motion.div
            className="progressbar__fill"
            animate={{ width: `${(step / (maxStep - 1)) * 100}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <span className="convdemo__stepno mono">{step + 1}/{maxStep}</span>
      </div>
    </div>
  )
}
