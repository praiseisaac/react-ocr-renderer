export enum FileType {
  PDF = 'pdf'
}

export type TextractBlock = {
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

export enum BlockType {
  PAGE = 'PAGE',
  LINE = 'LINE',
  WORD = 'WORD',
  TABLE = 'TABLE',
  CELL = 'CELL',
  SELECTION_ELEMENT = 'SELECTION_ELEMENT'
}

export type TextractBlockRenderProps = TextractBlock & {
  width: number;
  height: number;
}