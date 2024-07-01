import { atom } from 'jotai'

export type Theme = 'dark' | 'light' | 'system'
const defaultTheme = 'system'
export const themeAtom = atom<Theme>(defaultTheme)
