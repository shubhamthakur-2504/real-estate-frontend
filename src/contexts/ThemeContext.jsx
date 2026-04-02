import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark')
  const [isMounted, setIsMounted] = useState(false)

  // Initialize theme from localStorage
  useEffect(() => {
    const hasThemePreference = localStorage.getItem('theme-preference-set')
    const savedTheme = localStorage.getItem('theme')

    if (!hasThemePreference) {
      setTheme('dark')
      localStorage.setItem('theme', 'dark')
      localStorage.setItem('theme-preference-set', 'true')
    } else {
      setTheme(savedTheme || 'dark')
    }

    setIsMounted(true)
  }, [])

  // Apply theme to DOM
  useEffect(() => {
    if (!isMounted) return

    const htmlElement = document.documentElement

    if (theme === 'dark') {
      htmlElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
    }

    localStorage.setItem('theme', theme)
    localStorage.setItem('theme-preference-set', 'true')
  }, [theme, isMounted])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isMounted }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
