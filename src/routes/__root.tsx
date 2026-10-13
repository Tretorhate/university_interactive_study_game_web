import { useLayoutEffect, useState } from 'react'
import { createRootRoute, Link, Outlet, useRouterState } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { BookIcon, CpuIcon, HomeIcon, MapIcon, MoonIcon, SunIcon, TrophyIcon } from '../icons'

type Theme = 'light' | 'dark'

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  try {
    return window.localStorage.getItem('infoquest-theme-v1') === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

function RootLayout() {
  const [theme, setTheme] = useState<Theme>(getStoredTheme)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useLayoutEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.style.colorScheme = theme
    try {
      window.localStorage.setItem('infoquest-theme-v1', theme)
    } catch {
      // Keep the selected theme active for this session if storage is unavailable.
    }
  }, [theme])
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
        <button
          className="theme-toggle"
          type="button"
          title={theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'}
          aria-label={theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'}
          aria-pressed={theme === 'dark'}
          onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
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
