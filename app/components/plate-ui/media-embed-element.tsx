import { Tweet } from '@tweet/swr'
// above import is build error workaround for react-tweet module issue
// see: https://github.com/vercel/react-tweet/issues/143
// alias resolve path settings in vite.config.ts and tsconfig.json
// https://javascript.plainenglish.io/say-goodbye-to-relative-paths-how-to-resolve-alias-file-paths-with-vite-js-reactjs-typescript-3ef20a05bdb8
import LiteYouTubeEmbed from 'react-lite-youtube-embed'

import { cn, withRef } from '@udecode/cn'
import { PlateElement, withHOC } from '@udecode/plate-common'
import {
  ELEMENT_MEDIA_EMBED,
  parseVideoUrl,
  useMediaState,
} from '@udecode/plate-media'
import { ResizableProvider, useResizableStore } from '@udecode/plate-resizable'

import { themeAtom } from '@/lib/theme'
import { useAtom } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { CaptionTextareaSimple } from '../patch/CaptionTextArea'
import { Caption } from './caption'
import { MediaPopover } from './media-popover'
import { Resizable, ResizeHandle, mediaResizeHandleVariants } from './resizable'

// @udecode_plate-media の parseTwitterUrl がエラーを出すのでここに移動して修正
const twitterRegex = new RegExp(
  '^https?:\\/\\/(twitter|x)\\.com\\/(?:#!\\/)?(\\w+)\\/status(es)?\\/(?<id>\\d+)'
)
const parseTwitterUrlCustom = (url?: string) => {
  // url がないときは return（初期化時）
  if (!url) return undefined
  let _a, _b
  if (url.match(twitterRegex)) {
    return {
      id:
        (_b = (_a = twitterRegex.exec(url)) == null ? void 0 : _a.groups) ==
        null
          ? void 0
          : _b.id,
      provider: 'twitter',
      url,
    }
  }
}

const parseIframeUrl = (url?: string) => {
  const urlRegex = new RegExp('^http(s?):\\/\\/.*\\..*')
  if (!url || !url.startsWith('http')) return undefined
  // if not starting with http, assume pasting of full iframe embed code
  if (url.match(urlRegex)) {
    return {
      id: crypto.randomUUID(),
      provider: 'commonurl',
      url,
    }
  }
}

type OgpInfo = {
  image?: string
  site_name?: string
  title?: string
  type?: string
  url?: string
  description?: string
}

const Ogp = (readOnly: boolean, url?: string) => {
  const [ogpInfo, setOgpInfo] = useState<OgpInfo | undefined>(undefined)

  const [theme] = useAtom(themeAtom)

  const getOgpInfo = async (url?: string) => {
    if (!url) return undefined
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`
    const response = await fetch(proxyUrl)
    const html = await response.text()
    const domParser = new DOMParser()
    const dom = domParser.parseFromString(html, 'text/html')
    const ogp = Object.fromEntries(
      [...dom.head.children]
        .filter(
          (element) =>
            element.tagName === 'META' &&
            element.getAttribute('property')?.startsWith('og:')
        )
        .map((element) => {
          return [
            element.getAttribute('property')?.replace('og:', ''),
            element.getAttribute('content'),
          ]
        })
    ) as OgpInfo

    setOgpInfo(ogp)
  }

  useEffect(() => {
    getOgpInfo(url)
  }, [])

  if (!url) return <p>no url</p>

  return (
    <div
      className={`p-3 border rounded-lg border-solid border-gray-200 ${theme === 'light' ? 'hover:bg-blue-50' : 'hover:bg-gray-900'}`}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full divide-x-2 > *"
      >
        <div className="flex-1 p-2">
          <p className="font-bold">{ogpInfo?.title ?? 'no title'}</p>
          <p className="mt-4">{ogpInfo?.description}</p>
        </div>
        {ogpInfo?.image ? (
          <img className="flex-1 max-w-[50%] p-2" src={ogpInfo?.image} />
        ) : (
          <p className="flex-1">no image</p>
        )}
      </a>
    </div>
  )
}

export const MediaEmbedElement = withHOC(
  ResizableProvider,
  withRef<typeof PlateElement>(({ children, className, ...props }, ref) => {
    const {
      align = 'center',
      embed,
      focused,
      isTweet,
      isVideo,
      isYoutube,
      readOnly,
      selected,
    } = useMediaState({
      urlParsers: [parseTwitterUrlCustom, parseVideoUrl, parseIframeUrl],
    })
    const width = useResizableStore().get.width()
    const provider = embed?.provider

    const captionTextareaRef = useRef<HTMLTextAreaElement>(null)

    const onCaptionButtonClick = () => {
      if (captionTextareaRef.current) {
        captionTextareaRef.current.focus()
      }
    }

    console.log('mediaEmbedElement render')

    return (
      <MediaPopover
        pluginKey={ELEMENT_MEDIA_EMBED}
        onCaptionButtonClick={onCaptionButtonClick}
      >
        <PlateElement
          className={cn('relative py-2.5', className)}
          ref={ref}
          {...props}
        >
          <figure className="group relative m-0 w-full" contentEditable={false}>
            <Resizable
              align={align}
              options={{
                align,
                maxWidth: isTweet ? 550 : '100%',
                minWidth: isTweet ? 300 : 100,
              }}
            >
              <ResizeHandle
                className={mediaResizeHandleVariants({ direction: 'left' })}
                options={{ direction: 'left' }}
              />

              {isVideo ? (
                isYoutube ? (
                  <LiteYouTubeEmbed
                    id={embed!.id!}
                    title="youtube"
                    wrapperClass={cn(
                      'rounded-sm',
                      focused && selected && 'ring-2 ring-ring ring-offset-2',
                      'relative block cursor-pointer bg-black bg-cover bg-center [contain:content]',
                      '[&.lyt-activated]:before:absolute [&.lyt-activated]:before:top-0 [&.lyt-activated]:before:h-[60px] [&.lyt-activated]:before:w-full [&.lyt-activated]:before:bg-top [&.lyt-activated]:before:bg-repeat-x [&.lyt-activated]:before:pb-[50px] [&.lyt-activated]:before:[transition:all_0.2s_cubic-bezier(0,_0,_0.2,_1)]',
                      '[&.lyt-activated]:before:bg-[url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==)]',
                      'after:block after:pb-[var(--aspect-ratio)] after:content-[""]',
                      '[&_>_iframe]:absolute [&_>_iframe]:left-0 [&_>_iframe]:top-0 [&_>_iframe]:size-full',
                      '[&_>_.lty-playbtn]:z-[1] [&_>_.lty-playbtn]:h-[46px] [&_>_.lty-playbtn]:w-[70px] [&_>_.lty-playbtn]:rounded-[14%] [&_>_.lty-playbtn]:bg-[#212121] [&_>_.lty-playbtn]:opacity-80 [&_>_.lty-playbtn]:[transition:all_0.2s_cubic-bezier(0,_0,_0.2,_1)]',
                      '[&:hover_>_.lty-playbtn]:bg-[red] [&:hover_>_.lty-playbtn]:opacity-100',
                      '[&_>_.lty-playbtn]:before:border-y-[11px] [&_>_.lty-playbtn]:before:border-l-[19px] [&_>_.lty-playbtn]:before:border-r-0 [&_>_.lty-playbtn]:before:border-[transparent_transparent_transparent_#fff] [&_>_.lty-playbtn]:before:content-[""]',
                      '[&_>_.lty-playbtn]:absolute [&_>_.lty-playbtn]:left-1/2 [&_>_.lty-playbtn]:top-1/2 [&_>_.lty-playbtn]:[transform:translate3d(-50%,-50%,0)]',
                      '[&_>_.lty-playbtn]:before:absolute [&_>_.lty-playbtn]:before:left-1/2 [&_>_.lty-playbtn]:before:top-1/2 [&_>_.lty-playbtn]:before:[transform:translate3d(-50%,-50%,0)]',
                      '[&.lyt-activated]:cursor-[unset]',
                      '[&.lyt-activated]:before:pointer-events-none [&.lyt-activated]:before:opacity-0',
                      '[&.lyt-activated_>_.lty-playbtn]:pointer-events-none [&.lyt-activated_>_.lty-playbtn]:!opacity-0'
                    )}
                  />
                ) : (
                  <div
                    className={cn(
                      provider === 'vimeo' && 'pb-[75%]',
                      provider === 'youku' && 'pb-[56.25%]',
                      provider === 'dailymotion' && 'pb-[56.0417%]',
                      provider === 'coub' && 'pb-[51.25%]'
                    )}
                  >
                    <iframe
                      allowFullScreen
                      className={cn(
                        'absolute left-0 top-0 size-full rounded-sm',
                        isVideo && 'border-0',
                        focused && selected && 'ring-2 ring-ring ring-offset-2'
                      )}
                      src={embed!.url}
                      title="embed"
                    />
                  </div>
                )
              ) : null}

              {isTweet && (
                <div
                  className={cn(
                    '[&_.react-tweet-theme]:my-0',
                    !readOnly &&
                      selected &&
                      '[&_.react-tweet-theme]:ring-2 [&_.react-tweet-theme]:ring-ring [&_.react-tweet-theme]:ring-offset-2'
                  )}
                >
                  <Tweet id={embed!.id!} />
                </div>
              )}

              {!isVideo && !isTweet && (
                <div className="">
                  {/* <iframe
                    className={cn(
                      'absolute left-0 top-0 size-full rounded-sm',
                      focused && selected && 'ring-2 ring-ring ring-offset-2'
                    )}
                    src={embed!.url}
                    title="embed"
                  /> */}
                  {Ogp(readOnly, embed!.url)}
                </div>
              )}

              <ResizeHandle
                className={mediaResizeHandleVariants({ direction: 'right' })}
                options={{ direction: 'right' }}
              />
            </Resizable>

            <Caption align={align} style={{ width }}>
              <CaptionTextareaSimple
                placeholder={'Write a caption...'}
                readOnly={readOnly}
                ref={captionTextareaRef}
              />
            </Caption>
          </figure>

          {children}
        </PlateElement>
      </MediaPopover>
    )
  })
)
