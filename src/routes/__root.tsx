import { createRootRoute, Link, Outlet, useRouterState } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { BookIcon, CpuIcon, HomeIcon, MapIcon, TrophyIcon } from '../icons'

function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  return (
    <div className="app">
      <header className="topnav">
        <Link to="/" className="topnav__brand">
          <CpuIcon className="topnav__logo" />
          <span>
            Инфо<em>Квест</em>
          </span>
        </Link>
        <nav className="topnav__links">
          <Link to="/" className="topnav__link" activeOptions={{ exact: true }}>
            <HomeIcon /> <span>Главная</span>
          </Link>
          <Link to="/theory" className="topnav__link">
            <BookIcon /> <span>Теория</span>
          </Link>
          <Link to="/map" className="topnav__link">
            <MapIcon /> <span>Игры</span>
          </Link>
          <Link to="/results" className="topnav__link">
            <TrophyIcon /> <span>Результаты</span>
          </Link>
        </nav>
      </header>
      <main className="page">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>
      <footer className="foot">
        Учебная игра · Тема «Информация вокруг нас» · Цель 5.2.1.1
      </footer>
    </div>
  )
}

export const Route = createRootRoute({ component: RootLayout })
