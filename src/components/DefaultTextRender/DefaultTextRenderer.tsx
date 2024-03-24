import React from 'react'
import styles from './DefaultTextRenderer.module.css'
import { OCRBlockRenderProps } from '../../ReactOCRRenderer.types'

const DefaultTextRenderer = ({
  width,
  height,
  ...block
}: OCRBlockRenderProps) => {
  return (
    <div
      key={block.Id}
      className={styles.defaultRenderText}
      style={{
        left: `${block.Geometry.BoundingBox.Left * width}px`,
        top: `${block.Geometry.BoundingBox.Top * height}px`,
        width: `${block.Geometry.BoundingBox.Width * width}px`,
        height: `${block.Geometry.BoundingBox.Height * height}px`,
        fontSize: `calc(${block.Geometry.BoundingBox.Height * height}px * 0.8)`,
      }}
    >
      {block.Text}
    </div>
  )
}

export default DefaultTextRenderer