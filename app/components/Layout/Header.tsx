import { searchAtom } from '@/atoms/SearchAtom'

import { themeAtom } from '@/lib/theme'

import { useAuth } from '@/lib/auth.supabaseClient'
import { Link } from '@remix-run/react'
import { useAtom, useSetAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { useHydrated } from 'remix-utils/use-hydrated'
import { ModeToggle } from './ModeToggle'
import { Search } from './Search'
import SignInDialog from './SignInDialog'
import SignOutButton from './SignOutButton'

// https://v0.dev/t/xYHqD5MkVkT
export default function Header() {
  const hydrated = useHydrated()
  const { isLoggedIn } = useAuth()
  const setSearchWord = useSetAtom(searchAtom)

  useHydrateAtoms([[themeAtom, 'light']])
  const [theme] = useAtom(themeAtom)

  const resetSearch = () => {
    setSearchWord(undefined)
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-gray-950/90 font-sans font-thin h-16">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex h-16">
          <Link
            to={'/'}
            className="flex flex-0 sm:flex-1 flex-shrink-0 items-center ml-[5px] sm:ml-8 justify-start"
            onClick={resetSearch}
          >
            {!hydrated || theme == 'light' ? (
              <img src="owl.png" className="h-12" />
            ) : (
              <img src="owlwhite.png" className="h-12" />
            )}
          </Link>
          <nav className="flex gap-4 flex-1 justify-start sm:justify-center ml-4 sm:ml-0">
            <Link
              to={'/'}
              className="flex items-center text-sm transition-colors hover:underline"
              onClick={resetSearch}
            >
              Home
            </Link>
            <Link
              to={'/about'}
              className="flex items-center text-sm transition-colors hover:underline"
              onClick={resetSearch}
            >
              About
            </Link>
            {isLoggedIn && (
              <Link
                to={'/new'}
                className="flex items-center text-sm transition-colors hover:underline"
                onClick={resetSearch}
              >
                New
              </Link>
            )}
            <Link
              to={'/contact'}
              className="flex items-center text-sm transition-colors hover:underline"
              onClick={resetSearch}
            >
              Contact
            </Link>
          </nav>
          <div className="flex flex-1 items-center gap-1 sm:gap-4 mr-[5px] sm:mr-8 justify-end">
            <Search />
            <ModeToggle />
            {isLoggedIn ? <SignOutButton /> : <SignInDialog />}
            {/* for user create */}
            {/* <SignUpDialog /> */}
          </div>
        </div>
      </div>
    </nav>
  )
}
