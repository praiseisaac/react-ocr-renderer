import React, { useMemo } from 'react'
import {
  BlockType,
  FileType,
  OCRBlock,
  OCRBlockRenderProps,
  OcrData
} from './ReactOCRRenderer.types'
import OCRPdfRenderer from './components/OCrPdfRenderer/OCrPdfRenderer'

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
  customRenderComponent
}: {
  file: string
  type: FileType
  ocrData: OcrData
  searchText?: string[] | string
  highlightedBlockTypes?: BlockType[]
  customRenderComponent?: (props: OCRBlockRenderProps) => JSX.Element
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

  if (type === FileType.PDF) {
    const pageGroups = groupPages(filteredBlocks)

    return (
      <OCRPdfRenderer
        file={file}
        ocrData={pageGroups}
        customRenderComponent={customRenderComponent}
      />
    )
  }

  return <div>{file}</div>
}

export default ReactOCRRenderer
