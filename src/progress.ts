export interface LevelProgress {
  completed: boolean
  stars: number
  bestErrors: number
}

export type Progress = Record<string, LevelProgress>

const KEY = 'infoquest-progress-v1'

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Progress) : {}
  } catch {
    return {}
  }
}

export function saveLevelResult(levelId: string, stars: number, errors: number): Progress {
  const progress = loadProgress()
  const prev = progress[levelId]
  progress[levelId] = {
    completed: true,
    stars: Math.max(prev?.stars ?? 0, stars),
    bestErrors: prev ? Math.min(prev.bestErrors, errors) : errors,
  }
  localStorage.setItem(KEY, JSON.stringify(progress))
  return progress
}

export function resetProgress(): void {
  localStorage.removeItem(KEY)
}

export function starsFor(errors: number): number {
  if (errors === 0) return 3
  if (errors <= 2) return 2
  return 1
}
