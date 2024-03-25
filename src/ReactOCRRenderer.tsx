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
  ocrData,
  searchText = [],
  highlightedBlockTypes = [BlockType.WORD],
  customTextRenderComponent,
  customPageRenderComponent,
  size,
  showOnlyResultPages
}: {
  file: string
  type: FileType
  ocrData: OcrData
  searchText?: string[] | string
  highlightedBlockTypes?: BlockType[]
  customTextRenderComponent?: (props: OCRBlockRenderProps) => JSX.Element
  customPageRenderComponent?: (props: OCRPageRenderProps) => JSX.Element
  size?: {
    width: number
    height?: number
  }
  showOnlyResultPages?: boolean
}) => {
  const cleanedSearchText = useMemo(
    () =>
      typeof searchText === 'string'
        ? searchText.toLowerCase()
        : searchText.map((el) => el.toLowerCase()),
    [searchText]
  )

  const filteredBlocks = useMemo(
    () =>
      ocrData.Blocks.filter((block) => {
        if (!highlightedBlockTypes.includes(block.BlockType)) {
          return false
        }

        const textCheck =
          typeof cleanedSearchText === 'string'
            ? !block.Text.toLowerCase().includes(cleanedSearchText)
            : !cleanedSearchText.some((el) =>
                !block.Text ? false : block.Text.toLowerCase().includes(el)
              )

        if (cleanedSearchText.length && textCheck) {
          return false
        }

        return true
      }),
    [ocrData, cleanedSearchText, highlightedBlockTypes]
  )

  const pageGroups = useMemo(() => groupPages(filteredBlocks), [filteredBlocks])

  if (!Object.keys(pageGroups).length) {
    return <div>No data found</div>
  }

  if (type === FileType.PDF) {
    return (
      <OCRPdfRenderer
        file={file}
        ocrData={pageGroups}
        customTextRenderComponent={customTextRenderComponent}
        customPageRenderComponent={customPageRenderComponent}
        size={size}
        showOnlyResultPages={showOnlyResultPages}
      />
    )
  }

  return <div>{file}</div>
}

export default ReactOCRRenderer
