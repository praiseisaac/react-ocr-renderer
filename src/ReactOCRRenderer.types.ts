export enum FileType {
  PDF = 'pdf'
}

export enum BlockType {
  PAGE = 'PAGE',
  LINE = 'LINE',
  WORD = 'WORD',
  TABLE = 'TABLE',
  CELL = 'CELL',
  SELECTION_ELEMENT = 'SELECTION_ELEMENT'
}

export type OCRBlock = {
  BlockType: BlockType
  Geometry: {
    BoundingBox: {
      Width: number
      Height: number
      Left: number
      Top: number
    }
    Polygon: Array<{
      X: number
      Y: number
    }>
  }
  Id: string
  Relationships: Array<{
    Type: string
    Ids: string[]
  }>
  Page: number
  Confidence: number
  Text: string
}

export type OcrData = {
  Blocks: OCRBlock[]
  DocumentMetadata: {
    Pages: number
  }
}

export type OCRBlockRenderProps = OCRBlock & {
  width: number
  height: number
  selected?: boolean
}

export type OCRPageRenderProps = {
  page: number
  blocks?: OCRBlock[]
  children: React.ReactNode
}

export type OCROverlayRendererProps = {
  blocks: OCRBlock[]
  customTextRenderComponent?: (props: OCRBlockRenderProps) => JSX.Element
  width: number
  height: number
}

export type OCRPageGroup = {
  [key: number]: OCRBlock[]
}
