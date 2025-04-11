import { postIdAtom } from '@/atoms/PostIdAtoms'
import { searchAtom } from '@/atoms/SearchAtom'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useNavigate } from '@remix-run/react'
import { useAtomValue, useSetAtom } from 'jotai'
import { Search as SearchIcon } from 'lucide-react'
import { useState } from 'react'

export function Search() {
  const searchWord = useAtomValue(searchAtom)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [word, setWord] = useState<string | undefined>(searchWord)
  const navigate = useNavigate()

  const setSearchWord = useSetAtom(searchAtom)
  const postId = useAtomValue(postIdAtom)

  const onSearch = () => {
    setSearchWord(word)

    if (!word || word.length === 0) {
      setWord(undefined)
      setDialogOpen(false)
      navigate(`/${postId}`)
    }

    setDialogOpen(false)
    navigate(`/?q=${word}`)
    // setWord(undefined)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      onSearch()
    }
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        // if(!open) {
        //   something
        // }
        setDialogOpen(open)
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="font-thin text-xs px-2"
          variant="outline"
          onClick={() => {
            setDialogOpen(true)
          }}
        >
          <SearchIcon className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-thin">Search</DialogTitle>
          {/* <DialogDescription className="font-thin">
            and with | space |, or with | OR |
          </DialogDescription> */}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="search-input"
              type="search"
              className="col-span-3"
              defaultValue={searchWord}
              onChange={(e) => {
                setWord(e.target.value)
              }}
              onKeyDown={onKeyDown}
            />
            <Button
              className="font-thin"
              type="submit"
              onClick={() => {
                onSearch()
              }}
            >
              Search
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
