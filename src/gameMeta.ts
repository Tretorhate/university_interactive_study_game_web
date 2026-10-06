import type { ComponentType } from 'react'
import { CpuIcon, GridIcon, ShuffleIcon, type IconProps } from './icons'

export interface GameMeta {
  id: string
  code: string
  title: string
  Icon: ComponentType<IconProps>
  tagline: string
  goal: string
}

export const OBJECTIVE = '5.2.1.1'

export const GAMES: GameMeta[] = [
  {
    id: 'types',
    code: OBJECTIVE,
    title: 'Виды информации',
    Icon: GridIcon,
    tagline: 'Перетаскивай примеры в корзины форм',
    goal: 'Различать виды информации по форме представления: текстовая, графическая, звуковая, числовая, видео.',
  },
  {
    id: 'forms',
    code: OBJECTIVE,
    title: 'Пары: одна информация — две формы',
    Icon: ShuffleIcon,
    tagline: 'Соедини одинаковую информацию в разных формах',
    goal: 'Представлять одну и ту же информацию в разных формах.',
  },
  {
    id: 'binary',
    code: OBJECTIVE,
    title: 'Двоичный код · Екілік код',
    Icon: CpuIcon,
    tagline: 'Переводи биты в десятичные и hex-числа',
    goal: 'Понимать, что вся информация в компьютере хранится в виде двоичного кода (0 и 1).',
  },
]
