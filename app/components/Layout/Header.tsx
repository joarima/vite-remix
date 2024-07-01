import { searchAtom } from '@/atoms/SearchAtom'

import { themeAtom } from '@/lib/theme'

import { useAuth } from '@/lib/auth.supabaseClient'
import SignInDialog from '@/routes/signin'
import SignOut from '@/routes/signout'
import { Link } from '@remix-run/react'
import { useAtom, useSetAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { useHydrated } from 'remix-utils/use-hydrated'
import { ModeToggle } from './ModeToggle'
import { Search } from './Search'

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
        <div className="flex justify-between h-16 items-center">
          <Link
            to={'/'}
            className="flex flex-shrink-0 items-center ml-[5px] sm:ml-8"
            onClick={resetSearch}
          >
            {!hydrated || theme == 'light' ? (
              <img src="owl.png" className="h-12" />
            ) : (
              <img src="owlwhite.png" className="h-12" />
            )}
          </Link>
          <nav className="flex gap-4">
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
          <div className="flex items-center gap-4 mr-[5px] sm:mr-8">
            <Search />
            <ModeToggle />
            {isLoggedIn ? <SignOut /> : <SignInDialog />}
            {/* for user create */}
            {/* <SignUpDialog /> */}
          </div>
        </div>
      </div>
    </nav>
  )
}
