'use client'

import React from 'react'

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu'

import { ELEMENT_BLOCKQUOTE } from '@udecode/plate-block-quote'
import {
  focusEditor,
  insertEmptyElement,
  useEditorRef,
} from '@udecode/plate-common'
import { ELEMENT_H1, ELEMENT_H2, ELEMENT_H3 } from '@udecode/plate-heading'
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph'

import { Icons } from '@/components/plate-ui/icons'

import {
  ELEMENT_CODE_BLOCK,
  insertEmptyCodeBlock,
} from '@udecode/plate-code-block'
import { ELEMENT_EXCALIDRAW, insertExcalidraw } from '@udecode/plate-excalidraw'
import { ELEMENT_LINK, triggerFloatingLink } from '@udecode/plate-link'
import {
  ELEMENT_IMAGE,
  ELEMENT_MEDIA_EMBED,
  insertMedia,
} from '@udecode/plate-media'
import { ELEMENT_TABLE, insertTable } from '@udecode/plate-table'
import { ELEMENT_LINK_CARD } from '../custom-plate-ui/LinkCard'
import { insertLinkCard } from '../custom-plate-ui/insertLinkCard'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  useOpenState,
} from './dropdown-menu'
import { ToolbarButton } from './toolbar'

const items = [
  {
    items: [
      {
        description: 'Paragraph',
        icon: Icons.paragraph,
        label: 'Paragraph',
        value: ELEMENT_PARAGRAPH,
      },
      {
        description: 'Heading 1',
        icon: Icons.h1,
        label: 'Heading 1',
        value: ELEMENT_H1,
      },
      {
        description: 'Heading 2',
        icon: Icons.h2,
        label: 'Heading 2',
        value: ELEMENT_H2,
      },
      {
        description: 'Heading 3',
        icon: Icons.h3,
        label: 'Heading 3',
        value: ELEMENT_H3,
      },
      {
        description: 'Quote (⌘+⇧+.)',
        icon: Icons.blockquote,
        label: 'Quote',
        value: ELEMENT_BLOCKQUOTE,
      },
      {
        value: ELEMENT_TABLE,
        label: 'Table',
        description: 'Table',
        icon: Icons.table,
      },
      {
        value: 'ul',
        label: 'Bulleted list',
        description: 'Bulleted list',
        icon: Icons.ul,
      },
      {
        value: 'ol',
        label: 'Numbered list',
        description: 'Numbered list',
        icon: Icons.ol,
      },
      // {
      //   value: ELEMENT_HR,
      //   label: 'Divider',
      //   description: 'Divider (---)',
      //   icon: Icons.hr,
      // },
    ],
    label: 'Basic blocks',
  },
  {
    label: 'Media',
    items: [
      {
        value: ELEMENT_CODE_BLOCK,
        label: 'Code',
        description: 'Code (```)',
        icon: Icons.codeblock,
      },
      {
        value: ELEMENT_IMAGE,
        label: 'Image',
        description: 'Image',
        icon: Icons.image,
      },
      {
        value: ELEMENT_MEDIA_EMBED,
        label: 'Embed',
        description: 'Embed',
        icon: Icons.embed,
      },
      {
        value: ELEMENT_LINK_CARD,
        label: 'Link Card',
        description: 'Link Card',
        icon: Icons.notebook,
      },
      {
        value: ELEMENT_EXCALIDRAW,
        label: 'Excalidraw',
        description: 'Excalidraw',
        icon: Icons.excalidraw,
      },
    ],
  },
  {
    label: 'Inline',
    items: [
      {
        value: ELEMENT_LINK,
        label: 'Link',
        description: 'Link',
        icon: Icons.link,
      },
    ],
  },
]

export function InsertDropdownMenu(props: DropdownMenuProps) {
  const editor = useEditorRef()
  const openState = useOpenState()

  return (
    <DropdownMenu modal={false} {...openState} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton isDropdown pressed={openState.open} tooltip="Insert">
          <Icons.add />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="flex max-h-[500px] min-w-0 flex-col gap-0.5 overflow-y-auto"
      >
        {items.map(({ items: nestedItems, label }, index) => (
          <React.Fragment key={label}>
            {index !== 0 && <DropdownMenuSeparator />}

            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            {nestedItems.map(
              ({ icon: Icon, label: itemLabel, value: type }) => (
                <DropdownMenuItem
                  className="min-w-[180px]"
                  key={type}
                  onSelect={() => {
                    switch (type) {
                      case ELEMENT_CODE_BLOCK: {
                        insertEmptyCodeBlock(editor)

                        break
                      }
                      case ELEMENT_IMAGE: {
                        insertMedia(editor, { type: ELEMENT_IMAGE })

                        break
                      }
                      case ELEMENT_MEDIA_EMBED: {
                        insertMedia(editor, {
                          type: ELEMENT_MEDIA_EMBED,
                        })

                        break
                      }
                      case ELEMENT_LINK_CARD: {
                        insertLinkCard(editor)

                        break
                      }
                      case 'ul':
                      case 'ol': {
                        insertEmptyElement(editor, ELEMENT_PARAGRAPH, {
                          select: true,
                          nextBlock: true,
                        })

                        break
                      }
                      case ELEMENT_TABLE: {
                        insertTable(editor)

                        break
                      }
                      case ELEMENT_LINK: {
                        triggerFloatingLink(editor, { focused: true })

                        break
                      }
                      case ELEMENT_EXCALIDRAW: {
                        insertExcalidraw(editor)
                        break
                      }
                      default: {
                        insertEmptyElement(editor, type, {
                          nextBlock: true,
                          select: true,
                        })
                      }
                    }

                    focusEditor(editor)
                  }}
                >
                  <Icon className="mr-2 size-5" />
                  {itemLabel}
                </DropdownMenuItem>
              )
            )}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
