import React from 'react'
import { OCROverlayRendererProps } from '../../ReactOCRRenderer.types'
import DefaultTextRenderer from '../DefaultTextRender/DefaultTextRenderer'
import styles from './OCROverlayRenderer.module.css'
import { useReactOCRRenderer } from '../../contexts/ReactOcrRenderer.context'

const OCROverlayRenderer = ({
  blocks,
  width,
  height,
  customTextRenderComponent
}: OCROverlayRendererProps) => {
  const RenderText = customTextRenderComponent ?? DefaultTextRenderer
  const { currentBlock } = useReactOCRRenderer()

  return (
    <div className={styles.overlayContent}>
      <div className={styles.ocrPage}>
        {blocks?.map((block) => {
          return (
            <div
              key={block.Id}
              id={block.Id}
              style={{
                left: `${block.Geometry.BoundingBox.Left * width}px`,
                top: `${block.Geometry.BoundingBox.Top * height}px`,
                position: 'absolute'
              }}
            >
              <RenderText
                {...block}
                selected={currentBlock?.Id === block.Id}
                width={width}
                height={height}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OCROverlayRenderer
