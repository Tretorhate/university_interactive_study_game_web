import { useState } from 'react'
import { DndContext, DragOverlay, PointerSensor, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'motion/react'
import { FORMS, type FormId } from '../forms'
import type { GameMeta } from '../gameMeta'
import { GameShell } from '../components/GameShell'
import { useGame, shuffle } from '../useGame'
import { sfx } from '../sfx'
import { FlameIcon, HandIcon } from '../icons'

interface Item {
  text: string
  form: FormId
}

const ALL_ITEMS: Item[] = [
  // текстовая
  { text: 'Стихотворение в учебнике', form: 'text' },
  { text: 'Заметки на полях тетради', form: 'text' },
  { text: 'SMS от друга', form: 'text' },
  { text: 'Рецепт бабушкиного пирога', form: 'text' },
  { text: 'Объявление на стенде', form: 'text' },
  { text: 'Статья в энциклопедии', form: 'text' },
  // графическая
  { text: 'Фотография класса', form: 'graphic' },
  { text: 'Схема солнечной системы', form: 'graphic' },
  { text: 'Карта Казахстана', form: 'graphic' },
  { text: 'Афиша кинотеатра', form: 'graphic' },
  { text: 'Диаграмма роста продаж', form: 'graphic' },
  { text: 'Комикс в журнале', form: 'graphic' },
  // звуковая
  { text: 'Звонок на перемену', form: 'audio' },
  { text: 'Песня на уроке музыки', form: 'audio' },
  { text: 'Голосовое сообщение', form: 'audio' },
  { text: 'Запись лекции на диктофон', form: 'audio' },
  { text: 'Пение птиц за окном', form: 'audio' },
  { text: 'Сигнал прибывшего автобуса', form: 'audio' },
  // числовая
  { text: 'Ряд чисел: 2, 4, 6, 8', form: 'number' },
  { text: 'Температура за окном: −3°', form: 'number' },
  { text: 'Счёт матча 3:1', form: 'number' },
  { text: 'Список покупок с ценами', form: 'number' },
  { text: 'Расписание автобусов', form: 'number' },
  { text: 'Код замка велосипеда', form: 'number' },
  // видео
  { text: 'Видеоклип любимой группы', form: 'video' },
  { text: 'Сюжет вечерних новостей', form: 'video' },
  { text: 'Запись спектакля', form: 'video' },
  { text: 'Мультфильм на телефоне', form: 'video' },
  { text: 'Видеоурок по физике', form: 'video' },
  { text: 'Репортаж с соревнований', form: 'video' },
]

const ITEMS_PER_RUN = 12

/** По 2 карточки каждой формы гарантированно + 2 случайные — 12 за раунд. */
function buildQueue(): Item[] {
  const byForm = FORMS.map((f) => shuffle(ALL_ITEMS.filter((i) => i.form === f.id)))
  const base = byForm.flatMap((g) => g.slice(0, 2))
  const extras = shuffle(byForm.flatMap((g) => g.slice(2))).slice(0, ITEMS_PER_RUN - base.length)
  return shuffle([...base, ...extras])
}
function Card({ item, held, dragging, busy, onPick }: { item: Item; held: boolean; dragging: boolean; busy: boolean; onPick: () => void }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: 'card', disabled: busy })
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={{ transform: CSS.Translate.toString(transform) }}>
      <motion.div
        layout
        className={`dragcard${held ? ' is-held' : ''}${dragging ? ' is-dragging' : ''}`}
        animate={held ? { scale: [1, 1.04, 1] } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        onClick={onPick}
      >
        {item.text}
      </motion.div>
    </div>
  )
}

function Bin({ id, label, Icon, over, state, onTap }: { id: FormId; label: string; Icon: React.ComponentType<{ className?: string }>; over: boolean; state: 'idle' | 'good' | 'bad'; onTap: (id: FormId) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <button
      ref={setNodeRef}
      className={`bin${over || isOver ? ' is-over' : ''}${state === 'good' ? ' is-good' : ''}${state === 'bad' ? ' is-bad' : ''}`}
      onClick={() => onTap(id)}
    >
      <Icon />
      <span>{label}</span>
    </button>
  )
}

function Board({ onDone, onMistake }: { onDone: () => void; onMistake: () => void }) {
  const [queue, setQueue] = useState<Item[]>(buildQueue)
  const [dragging, setDragging] = useState(false)
  const [held, setHeld] = useState(false)
  const [goodBin, setGoodBin] = useState<FormId | null>(null)
  const [badBin, setBadBin] = useState<FormId | null>(null)
  const [streak, setStreak] = useState(0)
  const [busy, setBusy] = useState(false)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  const current = queue[0]
  const done = ITEMS_PER_RUN - queue.length

  const attempt = (form: FormId) => {
    if (!current || busy) return
    setHeld(false)
    if (form === current.form) {
      setBusy(true)
      sfx.correct()
      setGoodBin(form)
      setStreak((s) => s + 1)
      setTimeout(() => {
        setBusy(false)
        setGoodBin(null)
        const rest = queue.slice(1)
        if (rest.length === 0) onDone()
        else setQueue(rest)
      }, 480)
    } else {
      sfx.wrong()
      onMistake()
      setStreak(0)
      setBadBin(form)
    }
  }

  const onDragEnd = (e: DragEndEvent) => {
    setDragging(false)
    if (e.over) attempt(e.over.id as FormId)
  }

  const onBinTap = (id: FormId) => {
    if (held) attempt(id)
  }

  return (
    <>
      <div className="progressbar">
        <motion.div
          className="progressbar__fill"
          animate={{ width: `${(done / ALL_ITEMS.length) * 100}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>

      <p className="hint">
        <HandIcon className="inline-icon" /> Перетащи карточку в нужную форму — или нажми карточку,
        затем корзину. {done}/{ALL_ITEMS.length}
        {streak >= 2 && (
          <span className="streak" style={{ marginLeft: 10 }}>
            <FlameIcon /> серия ×{streak}
          </span>
        )}
      </p>

      <DndContext
        sensors={sensors}
        onDragStart={() => setDragging(true)}
        onDragEnd={onDragEnd}
        onDragCancel={() => setDragging(false)}
      >
        <div className="playcard">
          <span className="playcard__label">Информация</span>
          {current && (
            <Card
              item={current}
              held={held}
              dragging={dragging}
              busy={busy}
              onPick={() => {
                sfx.pick()
                setHeld((h) => !h)
              }}
            />
          )}
          <span className="playcard__label">Куда её отнести?</span>
        </div>

        <div className="bins">
          {FORMS.map(({ id, label, Icon }) => (
            <Bin
              key={id}
              id={id}
              label={label}
              Icon={Icon}
              over={held}
              state={goodBin === id ? 'good' : badBin === id ? 'bad' : 'idle'}
              onTap={onBinTap}
            />
          ))}
        </div>

        <DragOverlay>
          {dragging && current ? <div className="dragcard__overlay">{current.text}</div> : null}
        </DragOverlay>
      </DndContext>
    </>
  )
}

export function TypeSort({ meta }: { meta: GameMeta }) {
  const g = useGame(meta)
  return (
    <GameShell meta={meta} errors={g.errors} stars={g.stars} onRestart={g.restart}>
      <Board key={g.session} onDone={g.finish} onMistake={g.mistake} />
    </GameShell>
  )
}
