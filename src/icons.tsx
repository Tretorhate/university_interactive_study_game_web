import type { SVGProps } from 'react'

export type IconProps = SVGProps<SVGSVGElement>

function base(props: IconProps) {
  return {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    width: '1em',
    height: '1em',
    'aria-hidden': true,
    ...props,
  }
}

export function TextIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h10" />
    </svg>
  )
}

export function ImageIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.5-3.5a2 2 0 0 0-3 0L6 20" />
    </svg>
  )
}

export function SoundIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  )
}

export function NumberIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 4 7 20" />
      <path d="M17 4l-2 16" />
      <path d="M4 9h17" />
      <path d="M3 15h17" />
    </svg>
  )
}

export function VideoIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="m10 9 5 3-5 3V9Z" />
    </svg>
  )
}

export function GridIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

export function ShuffleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M2 18h4.5a4 4 0 0 0 3.2-1.6l4.6-6.8A4 4 0 0 1 17.5 8H22" />
      <path d="m18 4 4 4-4 4" />
      <path d="M2 6h4.5a4 4 0 0 1 2.7 1.1" />
      <path d="m18 20 4-4-4-4" />
      <path d="M14.7 16.9a4 4 0 0 0 2.8 1.1H22" />
    </svg>
  )
}

export function CpuIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
    </svg>
  )
}

export function BookIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2V4Z" />
      <path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7V4Z" />
    </svg>
  )
}

export function MapIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m9 3-6 2v16l6-2 6 2 6-2V3l-6 2-6-2Z" />
      <path d="M9 3v16" />
      <path d="M15 5v16" />
    </svg>
  )
}

export function StarIcon({ filled = false, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base(props)} fill={filled ? 'currentColor' : 'none'}>
      <path d="M12 2.5 15 9l7 .7-5.3 4.6 1.6 6.9L12 17.6l-6.3 3.6 1.6-6.9L2 9.7 9 9l3-6.5Z" />
    </svg>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m4 12.5 5.5 5.5L20 6.5" />
    </svg>
  )
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  )
}

export function RefreshIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M21 12a9 9 0 1 1-2.6-6.4" />
      <path d="M21 3v6h-6" />
    </svg>
  )
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 12h16" />
      <path d="m14 6 6 6-6 6" />
    </svg>
  )
}

export function HomeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  )
}

export function TrophyIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
      <path d="M8 5H4a3 3 0 0 0 4 4" />
      <path d="M16 5h4a3 3 0 0 1-4 4" />
      <path d="M12 13v4" />
      <path d="M8 21h8" />
      <path d="M10 17h4" />
    </svg>
  )
}

export function FlameIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 2c1 4-4 5.5-4 10a4 4 0 0 0 8 0c0-2-1-3.5-2-4.5-.5 1.2-1.4 1.8-2.5 2C12.5 7 13 4.5 12 2Z" />
      <path d="M12 22a7 7 0 0 0 7-7c0-3-1.5-5.4-3-7" />
      <path d="M5 15a7 7 0 0 0 2 5" />
    </svg>
  )
}

export function HandIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 11V4.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M12 10.5V3.5a1.5 1.5 0 0 1 3 0v7" />
      <path d="M15 10.5V6a1.5 1.5 0 0 1 3 0v7.5" />
      <path d="M18 13.5V12a1.5 1.5 0 0 1 3 0v4a7 7 0 0 1-7 7h-1.5a7 7 0 0 1-5.3-2.4L3.6 16.4a1.5 1.5 0 0 1 2.2-2L9 17V11" />
    </svg>
  )
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 4.5v15l13-7.5-13-7.5Z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function PauseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="6" y="4" width="4" height="16" fill="currentColor" stroke="none" />
      <rect x="14" y="4" width="4" height="16" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function StepBackIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 4v16" />
      <path d="M19 5v14L8 12l11-7Z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function StepForwardIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M18 4v16" />
      <path d="M5 5v14l11-7L5 5Z" fill="currentColor" stroke="none" />
    </svg>
  )
}
