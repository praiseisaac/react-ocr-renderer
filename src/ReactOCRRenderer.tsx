import React, { useMemo } from 'react'
import {
  BlockType,
  FileType,
  OCRBlock,
  OCRBlockRenderProps,
  OCRPageRenderProps,
  OcrData
} from './ReactOCRRenderer.types'
import OCRPdfRenderer from './components/OCRPdfRenderer/OCRPdfRenderer'

const groupPages = (blocks: OCRBlock[]) => {
  const pages: {
    [key: number]: OCRBlock[]
  } = {}

  blocks.forEach((block) => {
    pages[block.Page] = pages[block.Page] || []

    pages[block.Page].push(block)
  })
  return pages
}

const ReactOCRRenderer = ({
  file,
  type,
  ocrData = {
    Blocks: [],
    DocumentMetadata: {
      Pages: 0
    }
  },
  searchText = [],
  highlightedBlockTypes = [BlockType.WORD],
  customTextRenderComponent,
  customPageRenderComponent,
  size,
  showOnlyResultPages,
  showOCROverlay
}: {
  file: string
  type: FileType
  ocrData: OcrData
  searchText?: string[] | string | number
  highlightedBlockTypes?: BlockType[]
  customTextRenderComponent?: (props: OCRBlockRenderProps) => JSX.Element
  customPageRenderComponent?: (props: OCRPageRenderProps) => JSX.Element
  size?: {
    width: number
    height?: number
  }
  showOnlyResultPages?: boolean
  showOCROverlay?: boolean
}) => {
  const { Blocks = [] } = ocrData || {
    Blocks: [],
    DocumentMetadata: {
      Pages: 0
    }
  }

  const cleanedSearchText = useMemo<string[]>(() => {
    if (typeof searchText === 'string') {
      return [searchText.toLowerCase()]
    }

    if (typeof searchText === 'number') {
      return [searchText.toString()]
    }

    return searchText.map((el) => el.toString().toLowerCase())
  }, [searchText])

  const filteredBlocks = useMemo(
    () =>
      Blocks.filter((block) => {
        if (!highlightedBlockTypes.includes(block.BlockType)) {
          return false
        }

        let textCheck

        if (typeof cleanedSearchText === 'string') {
          textCheck = !block.Text.toLowerCase().includes(cleanedSearchText)
        }

        if (typeof cleanedSearchText === 'number') {
          textCheck = !block.Text.toLowerCase().includes(`${cleanedSearchText}`)
        }

        if (Array.isArray(cleanedSearchText)) {
          textCheck = !cleanedSearchText.some((el) =>
            block.Text.toLowerCase().includes(`${el}`)
          )
        }

        if (cleanedSearchText.length && textCheck) {
          return false
        }

        return true
      }),
    [ocrData, cleanedSearchText, highlightedBlockTypes]
  )

  const pageGroups = useMemo(() => groupPages(filteredBlocks), [filteredBlocks])
  console.log(searchText)
  if (type === FileType.PDF) {
    return (
      <OCRPdfRenderer
        file={file}
        ocrData={pageGroups}
        customTextRenderComponent={customTextRenderComponent}
        customPageRenderComponent={customPageRenderComponent}
        size={size}
        showOnlyResultPages={showOnlyResultPages}
        showOCROverlay={showOCROverlay}
      />
    )
  }

  return <div>{file}</div>
}

export default ReactOCRRenderer
