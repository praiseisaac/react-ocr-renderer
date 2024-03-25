import React from 'react'
import { OCRBlockRenderProps } from '../../ReactOCRRenderer.types'
import styles from './DefaultTextRenderer.module.css'

const DefaultTextRenderer = ({
  width,
  height,
  ...block
}: OCRBlockRenderProps) => {
  const defaultHeight = block.Geometry.BoundingBox.Height * height

  return (
    <div
      key={block.Id}
      className={styles.defaultRenderText}
      style={{
        width: `${block.Geometry.BoundingBox.Width * width}px`,
        height: `${defaultHeight}px`,
        fontSize: `calc(${defaultHeight}px * 0.8)`
      }}
    >
      {block.Text}
    </div>
  )
}

export default DefaultTextRenderer
