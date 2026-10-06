import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { FORM_BY_ID, type FormId } from '../forms'
import type { GameMeta } from '../gameMeta'
import { GameShell } from '../components/GameShell'
import { useGame, shuffle } from '../useGame'
import { sfx } from '../sfx'
import { CheckIcon, XIcon } from '../icons'

interface CardData {
  pairId: number
  side: 'a' | 'b'
  text: string
  form: FormId
}

/** Одна и та же информация в двух разных формах представления. */
const PAIR_DEFS: [string, string, FormId, FormId][] = [
  ['«Завтра солнечно, +20°» — прогноз на сайте', 'Голос диктора: «завтра солнечно, плюс двадцать»', 'text', 'audio'],
  ['Стихотворение, напечатанное в учебнике', 'Аудиозапись чтения того же стихотворения', 'text', 'audio'],
  ['Число 100 на ценнике в магазине', 'Кассир говорит: «сто тенге»', 'number', 'audio'],
  ['Ноты песни в тетради по музыке', 'Запись этой мелодии на телефоне', 'graphic', 'audio'],
  ['Математическая таблица умножения', 'Плакат-таблица на стене класса', 'number', 'graphic'],
  ['Список класса на двери кабинета', 'Учитель вслух перекликает тот же список', 'text', 'audio'],
  ['Числовой рецепт: «2 яйца, 200 г муки»', 'Фотография рецепта в кулинарной книге', 'number', 'graphic'],
  ['Меню столовой, напечатанное на стене', 'Диктор озвучивает то же меню', 'text', 'audio'],
  ['Написанная формула воды H₂O', 'Рисунок молекулы воды на плакате', 'text', 'graphic'],
  ['Набранный текст SMS «Встретимся в 5»', 'Видео, где показано написание того же SMS', 'text', 'video'],
  ['Спам-письмо «Скидка 50%!» в почте', 'Рекламный ролик про скидку 50% по телевизору', 'text', 'video'],
  ['Расписание уроков в таблице', '«Первый урок в 8:30» — объявление в классе', 'number', 'audio'],
  ['Оценка «5» в электронном дневнике', 'Учитель вслух объявляет «пять»', 'number', 'audio'],
  ['Таблица температур за неделю', 'График температур за ту же неделю', 'number', 'graphic'],
  ['Видеозапись школьного концерта', 'Аудиозапись того же концерта', 'video', 'audio'],
  ['Текст правил безопасности в буклете', 'Аудиоинструктаж с теми же правилами', 'text', 'audio'],
]

/** Пул 16 пар — каждый запуск берёт 12 случайных: 3 доски по 4. */
const PAIRS: [CardData, CardData][] = PAIR_DEFS.map(([ta, tb, fa, fb], i) => [
  { pairId: i, side: 'a', text: ta, form: fa },
  { pairId: i, side: 'b', text: tb, form: fb },
])

function makeBoards(): number[][] {
  const ids = shuffle(PAIRS.map((_, i) => i)).slice(0, 12)
  return [ids.slice(0, 4), ids.slice(4, 8), ids.slice(8, 12)]
}


function Board({ onDone, onMistake }: { onDone: () => void; onMistake: () => void }) {
  const [boards] = useState<number[][]>(makeBoards)
  const [board, setBoard] = useState(0)
  const [left, setLeft] = useState<CardData[]>(() => shuffle(boards[0].map((p) => PAIRS[p][0])))
  const [right, setRight] = useState<CardData[]>(() => shuffle(boards[0].map((p) => PAIRS[p][1])))
  const [sel, setSel] = useState<CardData | null>(null)
  const [matched, setMatched] = useState<number[]>([])
  const [miss, setMiss] = useState<CardData[]>([])

  const tap = (card: CardData) => {
    if (matched.includes(card.pairId)) return
    sfx.pick()
    if (!sel) {
      setSel(card)
      return
    }
    if (sel === card) {
      setSel(null)
      return
    }
    if (sel.pairId === card.pairId && sel.side !== card.side) {
      sfx.correct()
      const now = [...matched, card.pairId]
      setMatched(now)
      setSel(null)
      if (now.length === 4) {
        setTimeout(() => {
          if (board < 2) {
            const next = board + 1
            setBoard(next)
            setLeft(shuffle(boards[next].map((p) => PAIRS[p][0])))
            setRight(shuffle(boards[next].map((p) => PAIRS[p][1])))
            setMatched([])
            setMiss([])
          } else {
            onDone()
          }
        }, 900)
      }
    } else {
      sfx.wrong()
      onMistake()
      setMiss([sel, card])
      setSel(null)
      setTimeout(() => setMiss([]), 550)
    }
  }


  const PairCard = ({ c }: { c: CardData }) => {
    const fm = FORM_BY_ID[c.form]
    const isMatched = matched.includes(c.pairId)
    const isMiss = miss.includes(c)
    const isSel = sel === c
    return (
      <motion.button
        layout
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        whileTap={isMatched ? undefined : { scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className={`paircard${isMatched ? ' is-matched' : ''}${isMiss ? ' is-miss' : ''}${isSel ? ' is-sel' : ''}`}
        onClick={() => tap(c)}
        disabled={isMatched}
      >
        <span className="paircard__badge mono">
          {isMatched ? (
            <><CheckIcon /> <fm.Icon /> {fm.label}</>
          ) : isMiss ? (
            <><XIcon /> НЕ ПАРА</>
          ) : isSel ? (
            <>ВЫБРАНО</>
          ) : null}
        </span>
        <span className="paircard__text">{c.text}</span>
      </motion.button>
    )
  }

  return (
    <>
      <div className="progressbar">
        <motion.div
          className="progressbar__fill"
          animate={{ width: `${(((board * 4 + matched.length) / 12) * 100)}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
      <p className="hint">
        Найди пары: одна и та же информация, записанная в <strong>разных формах</strong>. После
        совпадения карточки покажут свою форму. Доска {board + 1}/3 · пар найдено:{' '}
        {board * 4 + matched.length}/12
      </p>
      <AnimatePresence initial={false}>
        <motion.div
          key={board}
          className="pairgrid"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22 }}
        >
          <div style={{ display: 'grid', gap: 12, alignContent: 'start' }}>
            {left.map((c) => (
              <PairCard key={`${c.pairId}-a`} c={c} />
            ))}
          </div>
          <div style={{ display: 'grid', gap: 12, alignContent: 'start' }}>
            {right.map((c) => (
              <PairCard key={`${c.pairId}-b`} c={c} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export function PairMatch({ meta }: { meta: GameMeta }) {
  const g = useGame(meta)
  return (
    <GameShell meta={meta} errors={g.errors} stars={g.stars} onRestart={g.restart}>
      <Board key={g.session} onDone={g.finish} onMistake={g.mistake} />
    </GameShell>
  )
}
