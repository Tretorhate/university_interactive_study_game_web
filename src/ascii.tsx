import { useEffect, useMemo, useRef, useState } from 'react'

const GLYPHS = '01!<>-_\\/[]{}=+*^?#АДИКЛМОРСТУШЯ'

/**
 * ASCII-поле: живая решётка из символов, периодически «переписывающая» себя.
 * Символы, подсвеченные курсором, становятся белыми.
 */
export function AsciiField({ rows = 12, cols = 56, className = '' }: { rows?: number; cols?: number; className?: string }) {
  const [seed, setSeed] = useState(0)
  const [hover, setHover] = useState(-1)
  useEffect(() => {
    const id = setInterval(() => setSeed((s) => s + 1), 140)
    return () => clearInterval(id)
  }, [])

  const cells = useMemo(() => {
    const rand = (n: number) => {
      // детерминированный «шум» от seed + позиции — поле «дышит», а не мерцает хаотично
      const x = Math.sin(n * 127.1 + seed * 0.9) * 43758.5453
      return x - Math.floor(x)
    }
    const out: string[] = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const n = r * cols + c
        const v = rand(n)
        out.push(v > 0.88 ? GLYPHS[Math.floor(v * 137) % GLYPHS.length] : v > 0.45 ? '1' : '0')
      }
    }
    return out
  }, [seed, rows, cols])

  return (
    <div
      className={`asciifield mono ${className}`}
      aria-hidden
      onMouseLeave={() => setHover(-1)}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const chW = rect.width / cols
        const chH = rect.height / rows
        setHover(Math.floor((e.clientY - rect.top) / chH) * cols + Math.floor((e.clientX - rect.left) / chW))
      }}
    >
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="asciifield__row">
          {Array.from({ length: cols }, (_, c) => {
            const n = r * cols + c
            const near = hover >= 0 && Math.abs((n % cols) - (hover % cols)) + Math.abs(r - Math.floor(hover / cols)) < 4
            return (
              <span key={c} className={near ? 'is-hot' : cells[n] !== '0' && cells[n] !== '1' ? 'is-glyph' : ''}>
                {cells[n]}
              </span>
            )
          })}
        </div>
      ))}
    </div>
  )
}

/** Эффект «дешифровки»: текст собирается из случайных символов. */
export function Scramble({ text, className = '', speed = 28 }: { text: string; className?: string; speed?: number }) {
  const [out, setOut] = useState(text)
  const frame = useRef(0)

  useEffect(() => {
    let i = 0
    frame.current = 0
    const id = setInterval(() => {
      i += 1
      frame.current = i
      const settled = Math.floor(i / 1.5)
      setOut(
        [...text]
          .map((ch, j) => (j < settled || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(''),
      )
      if (settled >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])

  return <span className={`scramble ${className}`}>{out}</span>
}

/** Вертикальный «дождь» из битов — одна строка, скроллится влево. */
export function BitTicker({ length = 96, className = '' }: { length?: number; className?: string }) {
  const [offset, setOffset] = useState(0)
  const stream = useMemo(
    () => Array.from({ length }, (_, i) => ((i * 7919) % 13 > 6 ? '1' : '0')).join(''),
    [length],
  )
  useEffect(() => {
    const id = setInterval(() => setOffset((o) => o + 1), 110)
    return () => clearInterval(id)
  }, [])
  const shown = (stream + stream + stream).slice(offset % length, (offset % length) + length)
  return (
    <div className={`bitticker mono ${className}`} aria-hidden>
      {[...shown].map((b, i) => (
        <span key={i} className={b === '1' ? 'is-one' : ''}>
          {b}
        </span>
      ))}
    </div>
  )
}

export const ASCII_TROPHY = [
  '  ┌─────────┐  ',
  ' ┌┤ ▓▓▓▓▓▓▓ ├┐ ',
  ' └┤ ▓▓▓▓▓▓▓ ├┘ ',
  '   │ ▓▓▓▓▓ │   ',
  '   └───────┘   ',
  '      ███      ',
  '   ┌───────┐   ',
  '   └───────┘   ',
]

/** Мини-ASCII для каждой формы информации: кадры зацикливаются. */
export const ASCII_FORMS: Record<string, string[]> = {
  text: [
    ['≡≡≡≡≡≡≡', '≡≡≡≡≡', '≡≡≡≡≡≡', '≡≡≡   ▌'].join('\n'),
    ['≡≡≡≡≡≡≡', '≡≡≡≡≡', '≡≡≡≡≡≡', '≡≡≡≡  ▌'].join('\n'),
    ['≡≡≡≡≡≡≡', '≡≡≡≡≡', '≡≡≡≡≡≡', '≡≡≡≡≡ ▌'].join('\n'),
    ['≡≡≡≡≡≡≡', '≡≡≡≡≡', '≡≡≡≡≡≡', '≡≡≡≡≡  '].join('\n'),
  ],
  graphic: [
    [' .·´¯·.  ', '( >o< ) ', ' ·._.·  '].join('\n'),
    ['  .·´¯·. ', '( -o- ) ', '  ·._.· '].join('\n'),
    ['   .·´¯·.', '( <o> ) ', '   ·._.·'].join('\n'),
    ['  .·´¯· ', '( -o- ) ', '  ·._.· '].join('\n'),
  ],
  audio: [
    ['▁ ▃ ▅ ▂ ▆ ▃ ▄ ▂', '   ♪   ♫  ', '▄ ▂ ▄ ▃ ▂ ▄ ▁ ▄'].join('\n'),
    ['▃ ▁ ▄ ▆ ▂ ▄ ▃ ▄', '    ♫  ♪ ', '▂ ▄ ▁ ▄ ▆ ▂ ▄ ▃'].join('\n'),
    ['▅ ▂ ▁ ▃ ▄ ▁ ▂ ▄', '  ♪    ♫ ', '▃ ▆ ▂ ▄ ▃ ▄ ▂ ▁'].join('\n'),
  ],
  number: [
    [' 012  ', ' 345  ', ' 678  ', '  9   '].join('\n'),
    [' 345  ', ' 678  ', '  9   ', ' 012  '].join('\n'),
    [' 678  ', '  9   ', ' 012  ', ' 345  '].join('\n'),
  ],
  video: [
    ['┌───────┐', '│  ▶    │', '│ ░░░░░ │', '└───────┘'].join('\n'),
    ['┌───────┐', '│   ▶   │', '│ ░▓▓░░ │', '└───────┘'].join('\n'),
    ['┌───────┐', '│    ▶  │', '│ ░░▓▓▓ │', '└───────┘'].join('\n'),
    ['┌───────┐', '│   ▶   │', '│ ░░░▓▓ │', '└───────┘'].join('\n'),
  ],
}

const FORM_FPS: Record<string, number> = { text: 520, graphic: 420, audio: 320, number: 600, video: 380 }

/** Анимированный ASCII-арт по ключу формы. */
export function FormAscii({ form, className = '' }: { form: string; className?: string }) {
  const [frame, setFrame] = useState(0)
  const frames = ASCII_FORMS[form]
  useEffect(() => {
    setFrame(0)
    if (!frames) return
    const id = setInterval(() => setFrame((f) => (f + 1) % frames.length), FORM_FPS[form] ?? 500)
    return () => clearInterval(id)
  }, [form, frames])
  if (!frames) return null
  return <pre className={`asciiart formascii ${className}`} aria-hidden>{frames[frame % frames.length]}</pre>
}
