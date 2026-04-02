import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export const ThemeSwitcher = () => {
  const { theme, toggleTheme, isMounted } = useTheme()

  if (!isMounted) {
    // Prevent hydration mismatch - render placeholder while mounting
    return <div className="w-10 h-10" />
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center p-2 rounded-lg
                 bg-light-secondary dark:bg-dark-secondary
                 text-light-primary dark:text-dark-primary
                 hover:bg-light-tertiary dark:hover:bg-dark-tertiary
                 transition-colors duration-200
                 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                 dark:focus:ring-offset-dark-bg"
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon size={20} className="text-primary-600" />
      ) : (
        <Sun size={20} className="text-yellow-400" />
      )}
    </button>
  )
}
