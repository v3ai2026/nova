import { THEME, STORAGE_KEYS } from '~/utils/constants'

export const useTheme = () => {
  const theme = useState<'light' | 'dark'>('theme', () => 'dark')
  const isDark = computed(() => theme.value === 'dark')

  const initTheme = () => {
    if (process.client) {
      const stored = localStorage.getItem(STORAGE_KEYS.THEME)
      if (stored && (stored === THEME.LIGHT || stored === THEME.DARK)) {
        theme.value = stored
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        theme.value = THEME.DARK
      } else {
        theme.value = THEME.LIGHT
      }
      applyTheme()
    }
  }

  const applyTheme = () => {
    if (process.client) {
      if (theme.value === THEME.DARK) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
    if (process.client) {
      localStorage.setItem(STORAGE_KEYS.THEME, newTheme)
      applyTheme()
    }
  }

  const toggleTheme = () => {
    setTheme(theme.value === THEME.LIGHT ? THEME.DARK : THEME.LIGHT)
  }

  return {
    theme,
    isDark,
    initTheme,
    setTheme,
    toggleTheme
  }
}
