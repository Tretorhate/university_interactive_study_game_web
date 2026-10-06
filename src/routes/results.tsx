import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { GAMES, OBJECTIVE } from '../gameMeta'
import { loadProgress, resetProgress } from '../progress'
import { RefreshIcon, StarIcon, TrophyIcon } from '../icons'

function ResultsPage() {
  const [progress, setProgress] = useState(loadProgress)
  const doneCount = GAMES.filter((g) => progress[g.id]?.completed).length
  const totalStars = GAMES.reduce((sum, g) => sum + (progress[g.id]?.stars ?? 0), 0)
  const allDone = doneCount === GAMES.length

  return (
    <section>
      <h1 className="page__title">
        <TrophyIcon className="inline-icon" /> Результаты
      </h1>
      <p className="page__sub">
        Цель {OBJECTIVE}: {allDone ? 'достигнута!' : `пройдено ${doneCount} из ${GAMES.length} игр`}{' '}
        · Звёзды: {totalStars}/{GAMES.length * 3}
      </p>

      {allDone && (
        <div className="banner">
          Поздравляем! Ты различаешь виды информации по форме представления и знаешь, что в компьютере
          она хранится в двоичном коде.
        </div>
      )}

      <div className="results">
        {GAMES.map((g) => {
          const p = progress[g.id]
          return (
            <div key={g.id} className="results__row">
              <g.Icon className="results__icon" />
              <div className="results__body">
                <div className="results__title">{g.title}</div>
                <div className="results__goal">{g.goal}</div>
              </div>
              <div className="results__stars">
                {[0, 1, 2].map((s) => (
                  <StarIcon key={s} filled={s < (p?.stars ?? 0)} />
                ))}
              </div>
              {p?.completed ? (
                <span className="results__meta">ошибок: {p.bestErrors}</span>
              ) : (
                <Link to="/levels/$levelId" params={{ levelId: g.id }} className="btn btn--sm">
                  Играть
                </Link>
              )}
            </div>
          )
        })}
      </div>

      <button
        className="btn btn--ghost"
        onClick={() => {
          resetProgress()
          setProgress({})
        }}
      >
        <RefreshIcon /> Сбросить прогресс
      </button>
    </section>
  )
}

export const Route = createFileRoute('/results')({ component: ResultsPage })
