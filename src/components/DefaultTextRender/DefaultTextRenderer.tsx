import React from 'react'
import { OCRBlockRenderProps } from '../../ReactOCRRenderer.types'
import styles from './DefaultTextRenderer.module.css'

const DefaultTextRenderer = ({
  width,
  height,
  selected,
  ...block
}: OCRBlockRenderProps) => {
  const defaultHeight = Math.max(15, block.Geometry.BoundingBox.Height * height)

  return (
    <div
      key={block.Id}
      className={`${styles.defaultRenderText} ${
        selected ? styles.selected : ''
      }`}
      style={{
        width: `${block.Geometry.BoundingBox.Width * width + 10}px`,
        minHeight: `${defaultHeight + 4}px`,
        fontSize: `calc(${defaultHeight}px * 0.7)`
      }}
    >
      {block.Text}
    </div>
  )
}

export default DefaultTextRenderer
