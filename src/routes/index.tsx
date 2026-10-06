import { createFileRoute, Link } from '@tanstack/react-router'
import { GAMES, OBJECTIVE } from '../gameMeta'
import { ArrowRightIcon, BookIcon } from '../icons'
import { AsciiField, Scramble } from '../ascii'

function HomePage() {
  return (
    <section className="hero">
      <p className="hero__badge">Тема 2 · Біздің айналамыздағы ақпарат</p>
      <h1 className="hero__title">
        <Scramble text="Информация" speed={26} /> <em>вокруг нас</em>
      </h1>
      <p className="hero__sub">
        Интерактивная игра по информатике. Цель обучения <strong>{OBJECTIVE}</strong>: различать виды
        информации по форме представления (текстовая, графическая, звуковая, числовая, видео) и понимать,
        что в компьютере информация хранится в двоичном коде.
      </p>
      <div className="hero__actions">
        <Link to="/theory" className="btn">
          <BookIcon /> Сначала теория
        </Link>
        <Link to="/map" className="btn btn--primary">
          Играть <ArrowRightIcon />
        </Link>
      </div>
      <AsciiField rows={7} cols={64} className="hero__field" />
      <div className="hero__games">
        {GAMES.map((g, i) => (
          <Link key={g.id} to="/levels/$levelId" params={{ levelId: g.id }} className="hero__card">
            <span className="hero__num">{i + 1}</span>
            <g.Icon className="hero__icon" />
            <h3>{g.title}</h3>
            <p>{g.tagline}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export const Route = createFileRoute('/')({ component: HomePage })
