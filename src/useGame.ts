import { useState } from 'react'
import { saveLevelResult, starsFor } from './progress'
import type { GameMeta } from './gameMeta'

export function shuffle<T>(items: T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Общий цикл мини-игры: счёт ошибок, завершение со звёздами, рестарт. */
export function useGame(meta: GameMeta) {
  const [errors, setErrors] = useState(0)
  const [stars, setStars] = useState<number | null>(null)
  const [session, setSession] = useState(0)

  const mistake = () => setErrors((e) => e + 1)

  const finish = () => {
    const s = starsFor(errors)
    saveLevelResult(meta.id, s, errors)
    setStars(s)
  }

  const restart = () => {
    setErrors(0)
    setStars(null)
    setSession((s) => s + 1)
  }

  return { errors, stars, session, mistake, finish, restart }
}
