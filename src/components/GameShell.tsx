import { useEffect, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import confetti from 'canvas-confetti'
import type { GameMeta } from '../gameMeta'
import { ASCII_TROPHY, Scramble } from '../ascii'
import { MapIcon, RefreshIcon, StarIcon, TrophyIcon, XIcon } from '../icons'
import { sfx } from '../sfx'

interface Props {
  meta: GameMeta
  errors: number
  stars: number | null
  onRestart: () => void
  children: ReactNode
}

export function GameShell({ meta, errors, stars, onRestart, children }: Props) {
  useEffect(() => {
    if (stars === null) return
    sfx.win()
    confetti({
      particleCount: 130,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ffffff', '#bbbbbb', '#555555'],
    })
  }, [stars])

  return (
    <section className="game">
      <header className="game__head">
        <div className="game__icon">
          <meta.Icon style={{ width: 26, height: 26 }} />
        </div>
        <div>
          <p className="game__code">Цель {meta.code}</p>
          <h1 className="game__title"><Scramble text={meta.title} speed={22} /></h1>
          <p className="game__goal">{meta.goal}</p>
        </div>
        <motion.div
          className="game__stats"
          title="Ошибки"
          key={errors}
          initial={errors > 0 ? { scale: 1.35 } : false}
          animate={{ scale: 1 }}
        >
          <XIcon />
          <span>{errors}</span>
        </motion.div>
      </header>

      <div className="game__body">{children}</div>

      {stars !== null && (
        <motion.div
          className="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="modal__card"
            initial={{ scale: 0.9, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          >
            <pre className="asciiart">{ASCII_TROPHY.join('\n')}</pre>
            <div className="modal__stars">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.25 + i * 0.18, type: 'spring', stiffness: 400, damping: 15 }}
                  style={{ display: 'inline-flex' }}
                >
                  <StarIcon filled={i < stars} className={`modal__star${i < stars ? ' is-lit' : ''}`} />
                </motion.span>
              ))}
            </div>
            <h2>Уровень пройден</h2>
            <p className="modal__text">
              Ошибок: {errors}.{' '}
              {stars === 3 ? 'Идеально — ни одной ошибки.' : 'Пройди ещё раз, чтобы получить 3 звезды.'}
            </p>
            <div className="modal__actions">
              <button className="btn" onClick={onRestart}>
                <RefreshIcon /> Заново
              </button>
              <Link to="/map" className="btn btn--primary">
                <MapIcon /> К играм
              </Link>
              <Link to="/results" className="btn btn--ghost">
                <TrophyIcon /> Результаты
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
