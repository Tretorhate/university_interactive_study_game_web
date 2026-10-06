import type { ComponentType } from 'react'
import { ImageIcon, NumberIcon, SoundIcon, TextIcon, VideoIcon, type IconProps } from './icons'

export type FormId = 'text' | 'graphic' | 'audio' | 'number' | 'video'

export interface FormMeta {
  id: FormId
  label: string
  Icon: ComponentType<IconProps>
}

export const FORMS: FormMeta[] = [
  { id: 'text', label: 'Текстовая', Icon: TextIcon },
  { id: 'graphic', label: 'Графическая', Icon: ImageIcon },
  { id: 'audio', label: 'Звуковая', Icon: SoundIcon },
  { id: 'number', label: 'Числовая', Icon: NumberIcon },
  { id: 'video', label: 'Видео', Icon: VideoIcon },
]

export const FORM_BY_ID: Record<FormId, FormMeta> = Object.fromEntries(
  FORMS.map((f) => [f.id, f]),
) as Record<FormId, FormMeta>
