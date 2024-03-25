import React from 'react'
import { OCROverlayRendererProps } from '../../ReactOCRRenderer.types'
import DefaultTextRenderer from '../DefaultTextRender/DefaultTextRenderer'
import styles from './OCROverlayRenderer.module.css'

const OCROverlayRenderer = ({
  blocks,
  width,
  height,
  customTextRenderComponent
}: OCROverlayRendererProps) => {
  const RenderText = customTextRenderComponent ?? DefaultTextRenderer

  return (
    <div className={styles.overlayContent}>
      <div className={styles.ocrPage}>
        {blocks?.map((block) => {
          return (
            <div
              key={block.Id}
              style={{
                left: `${block.Geometry.BoundingBox.Left * width}px`,
                top: `${block.Geometry.BoundingBox.Top * height}px`,
                position: 'absolute'
              }}
            >
              <RenderText {...block} width={width} height={height} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OCROverlayRenderer
