import { searchAtom } from '@/atoms/SearchAtom'
import { Link } from '@remix-run/react'
import { useSetAtom } from 'jotai'

export default function Footer() {
  const setSearchWord = useSetAtom(searchAtom)
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 bg-white shadow-sm dark:bg-gray-950/90 font-thin">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-14 items-center">
          <div className="flex items-center">
            <span className="sr-only">title</span>
          </div>
          <nav className="flex gap-4">
            <Link
              to={'/'}
              className="flex items-center text-sm transition-colors hover:underline"
              onClick={() => {
                setSearchWord(undefined)
              }}
            >
              Home
            </Link>
            <Link
              to={'/about'}
              className="flex items-center text-sm transition-colors hover:underline"
            >
              About
            </Link>
            <Link
              to={'/contact'}
              className="flex items-center text-sm transition-colors hover:underline"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </nav>
  )
}
