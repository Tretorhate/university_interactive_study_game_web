import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { GAMES } from '../gameMeta'
import { loadProgress } from '../progress'
import { ArrowRightIcon, CheckIcon, StarIcon } from '../icons'

function MapPage() {
  const [progress] = useState(loadProgress)
  const doneCount = GAMES.filter((g) => progress[g.id]?.completed).length

  return (
    <section>
      <h1 className="page__title">Карта игр</h1>
      <p className="page__sub">
        Пройдено {doneCount} из {GAMES.length}. Цель 5.2.1.1 засчитана, когда закрыты все три игры.
      </p>
      <div className="levels">
        {GAMES.map((g, i) => {
          const p = progress[g.id]
          return (
            <Link key={g.id} to="/levels/$levelId" params={{ levelId: g.id }} className="level">
              <span className="level__num">{i + 1}</span>
              <span className="level__icon">
                <g.Icon />
              </span>
              <span className="level__body">
                <span className="level__title">
                  {g.title}
                  {p?.completed && <CheckIcon className="level__done" />}
                </span>
                <span className="level__tagline">{g.tagline}</span>
                <span className="level__stars">
                  {[0, 1, 2].map((s) => (
                    <StarIcon key={s} filled={s < (p?.stars ?? 0)} />
                  ))}
                </span>
              </span>
              <ArrowRightIcon className="level__go" />
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export const Route = createFileRoute('/map')({ component: MapPage })
