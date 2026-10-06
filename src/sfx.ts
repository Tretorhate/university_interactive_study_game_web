/** Синтезированные звуки через WebAudio — без файлов. Первый вызов создаёт контекст в жесте клика. */
let ctx: AudioContext | null = null

function tone(freq: number, delay: number, dur: number, type: OscillatorType = 'sine', gain = 0.14) {
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    const t0 = ctx.currentTime + delay
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = type
    o.frequency.value = freq
    g.gain.setValueAtTime(gain, t0)
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur)
    o.connect(g).connect(ctx.destination)
    o.start(t0)
    o.stop(t0 + dur)
  } catch {
    /* no audio — ignore */
  }
}

export const sfx = {
  pick: () => tone(520, 0, 0.06, 'triangle', 0.07),
  flip: () => tone(700, 0, 0.05, 'square', 0.05),
  correct: () => {
    tone(523, 0, 0.12)
    tone(784, 0.09, 0.2)
  },
  wrong: () => tone(170, 0, 0.22, 'sawtooth', 0.11),
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.28)),
}
