import { createFileRoute, Navigate } from '@tanstack/react-router'
import type { ComponentType } from 'react'
import { GAMES, type GameMeta } from '../gameMeta'
import { TypeSort } from '../games/TypeSort'
import { PairMatch } from '../games/PairMatch'
import { BinaryLab } from '../games/BinaryLab'

const GAME_COMPONENTS: Record<string, ComponentType<{ meta: GameMeta }>> = {
  types: TypeSort,
  forms: PairMatch,
  binary: BinaryLab,
}

function LevelPage() {
  const { levelId } = Route.useParams()
  const meta = GAMES.find((g) => g.id === levelId)
  const Game = meta && GAME_COMPONENTS[meta.id]

  if (!meta || !Game) return <Navigate to="/map" replace />
  return <Game meta={meta} />
}

export const Route = createFileRoute('/levels/$levelId')({ component: LevelPage })
