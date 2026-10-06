import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { FORMS } from '../forms'
import { BitTicker, FormAscii, Scramble } from '../ascii'
import { ConvDemo } from '../components/ConvDemo'
import { ArrowRightIcon, CpuIcon } from '../icons'
const EXAMPLES: Record<string, { desc: string; items: string[] }> = {
  text: { desc: 'Знаки и символы', items: ['Учебник, письмо', 'Заметка на доске', 'СМС от друга', 'Стихотворение'] },
  graphic: { desc: 'Изображение', items: ['Фотография, рисунок', 'Схема, карта', 'Афиша к фильму', 'Комикс'] },
  audio: { desc: 'Звук', items: ['Речь, музыка, шум', 'Сигнал будильника', 'Голосовое сообщение', 'Пение птиц'] },
  number: { desc: 'Числа и вычисления', items: ['Цены, даты', 'Результаты измерений', 'Счёт матча', 'Температура'] },
  video: { desc: 'Изображение + звук', items: ['Фильм, мультфильм', 'Видеоролик', 'Клип', 'Запись урока'] },
}

const BINARY_DEMO: [string, string, string][] = [
  ['Текст', 'Буква A (ASCII)', '01000001'],
  ['Картинка', 'Пиксель', '0101'],
  ['Звук', 'Отсчёт сигнала', '1011'],
  ['Число', '5', '0101'],
]

const STATUS_TAG: Record<string, string> = {
  text: 'TXT',
  graphic: 'IMG',
  audio: 'WAV',
  number: 'NUM',
  video: 'MP4',
}

function FormCard({ id, label, Icon, index }: { id: string; label: string; Icon: React.ComponentType<{ className?: string }>; index: number }) {
  const pool = EXAMPLES[id].items
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    const id2 = setInterval(() => setOffset((o) => (o + 1) % pool.length), 5000)
    return () => clearInterval(id2)
  }, [pool.length])
  const shown = [pool[offset % pool.length], pool[(offset + 1) % pool.length]]
  return (
    <motion.article
      className="theory__card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 220, damping: 22 }}
      whileHover={{ y: -4 }}
    >
      <header className="theory__card-head">
        <Icon className="theory__icon" />
        <h3>{label}</h3>
        <span className="theory__idx mono">0{index + 1}</span>
      </header>
      <div className="theory__panel">
        <span className="theory__tag mono">{STATUS_TAG[id]}</span>
        <FormAscii form={id} className="theory__ascii" />
      </div>
      <p className="theory__desc">{EXAMPLES[id].desc}</p>
      <ul>
        {shown.map((ex) => (
          <li key={ex}><Scramble text={ex} speed={16} /></li>
        ))}
      </ul>
    </motion.article>
  )
}
function TheoryPage() {
  return (
    <section>
      <h1 className="page__title">Теория: виды информации</h1>
      <p className="page__sub">
        Человек воспринимает информацию органами чувств и представляет её в разных формах. Вот пять
        основных видов по форме представления — с примерами из жизни.
      </p>


      <div className="theory__grid">
        {FORMS.map(({ id, label, Icon }, i) => (
          <FormCard key={id} id={id} label={label} Icon={Icon} index={i} />
        ))}
      </div>

      <div className="theory__binary">
        <div className="theory__binary-head">
          <CpuIcon className="theory__icon" />
          <h2>А как хранит информацию компьютер?</h2>
        </div>
        <p>
          Компьютер «понимает» только два состояния — есть сигнал (1) и нет сигнала (0). Поэтому{' '}
          <strong>любую</strong> информацию он кодирует цепочками из нулей и единиц — двоичным кодом.
        </p>
        <div className="theory__demo">
          {BINARY_DEMO.map(([what, item, code]) => (
            <div key={item} className="theory__demo-row">
              <span className="theory__demo-what">{what}</span>
              <span className="theory__demo-item">{item}</span>
              <ArrowRightIcon className="theory__demo-arrow" />
              <code className="theory__demo-code">{code}</code>
            </div>
          ))}
        </div>
        <BitTicker />
        <p className="hint hint--dim">
          В игре «Двоичный код» ты сам переведёшь биты в десятичные и шестнадцатеричные числа.
        </p>
      </div>

      <div className="theory__binary">
        <div className="theory__binary-head">
          <CpuIcon className="theory__icon" />
          <h2>Как переводить коды</h2>
        </div>
        <div className="convgrid">
          <article className="conv">
            <h3>Двоичный → десятичный</h3>
            <ol className="convsteps">
              <li>Подпиши над каждым битом степень двойки справа налево: 2⁰, 2¹, 2²…</li>
              <li>Умножь каждый бит на его степень.</li>
              <li>Сложи результаты.</li>
            </ol>
            <table className="convtable">
              <tbody>
                <tr><th>бит</th><td>1</td><td>1</td><td>0</td><td>1</td></tr>
                <tr><th>2<sup>n</sup></th><td>2³=8</td><td>2²=4</td><td>2¹=2</td><td>2⁰=1</td></tr>
                <tr><th>произведение</th><td className="hl">8</td><td className="hl">4</td><td>0</td><td className="hl">1</td></tr>
              </tbody>
            </table>
            <code className="conv__example">(1101)₂ = 8 + 4 + 0 + 1 = <b>(13)₁₀</b></code>
          </article>
          <article className="conv">
            <h3>Десятичный → двоичный</h3>
            <ol className="convsteps">
              <li>Дели число на 2, записывай остаток.</li>
              <li>Повторяй с частным, пока частное не станет 0.</li>
              <li>Биты — остатки, читаются снизу вверх.</li>
            </ol>
            <table className="convtable">
              <thead>
                <tr><th>частное</th><th>÷ 2 =</th><th>остаток</th></tr>
              </thead>
              <tbody>
                <tr><td>13</td><td>6</td><td>1</td></tr>
                <tr><td>6</td><td>3</td><td>0</td></tr>
                <tr><td>3</td><td>1</td><td>1</td></tr>
                <tr><td>1</td><td>0</td><td className="hl">1</td></tr>
              </tbody>
            </table>
            <code className="conv__example">(13)₁₀ → читаем остатки вверх ↑ = <b>(1101)₂</b></code>
          </article>
          <article className="conv">
            <h3>Двоичный → hex</h3>
            <ol className="convsteps">
              <li>Разбей биты на группы по 4 справа налево (quads).</li>
              <li>Каждую группу переведи в десятичное.</li>
              <li>Замени 10–15 на A–F — получишь hex-цифры.</li>
            </ol>
            <table className="convtable">
              <tbody>
                <tr><th>группа</th><td>1101</td><td>0101</td></tr>
                <tr><th>→ dec</th><td>13</td><td>5</td></tr>
                <tr><th>→ hex</th><td className="hl">D</td><td className="hl">5</td></tr>
              </tbody>
            </table>
            <code className="conv__example">(11010101)₂ = <b>(D5)₁₆</b></code>
          </article>
          <article className="conv">
            <h3>Hex → двоичный / десятичный</h3>
            <ol className="convsteps">
              <li>Каждую hex-цифру запиши как 4 бита по таблице.</li>
              <li>В десятичную: цифра × 16<sup>позиция</sup>, сложи.</li>
            </ol>
            <table className="convtable">
              <tbody>
                <tr><th>hex</th><td>D = 13</td><td>5</td></tr>
                <tr><th>→ биты</th><td className="hl">1101</td><td className="hl">0101</td></tr>
                <tr><th>× 16ⁿ</th><td>13·16¹</td><td>5·16⁰</td></tr>
              </tbody>
            </table>
            <code className="conv__example">(D5)₁₆ = 208 + 5 = <b>(213)₁₀</b></code>
            <code className="conv__weights">10=A · 11=B · 12=C · 13=D · 14=E · 15=F</code>
          </article>
        </div>
        <ConvDemo />
      </div>

      <Link to="/map" className="btn btn--primary">
        Перейти к играм <ArrowRightIcon />
      </Link>
    </section>
  )
}

export const Route = createFileRoute('/theory')({ component: TheoryPage })
