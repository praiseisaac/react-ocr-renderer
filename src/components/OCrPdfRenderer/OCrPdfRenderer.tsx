import React, { useCallback, useEffect, useState } from 'react'
import { pdfjs, Document, Page } from 'react-pdf'
import styles from './OCRPdfRenderer.module.css'
import DefaultTextRenderer from '../DefaultTextRender/DefaultTextRenderer';
import { OCRBlock, OCRBlockRenderProps } from '../../ReactOCRRenderer.types';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;


const OCRPdfRenderer = ({
  file,
  ocrData,
  customRenderComponent
}: {
  file: string
  ocrData: {
    [key: number]: OCRBlock[]
  },
  customRenderComponent?: (props: OCRBlockRenderProps) => JSX.Element
}) => {
  const [pages, setPages] = useState<string[]>([])
  const [{ width, height }, setPageSize] = useState<{
    width: number
    height: number
  }>({
    width: 0,
    height: 0
  })

  const handlePageLoad = useCallback(async () => {
    if (!file) {
      return
    }

    const docData = await pdfjs.getDocument(file).promise

    const pageCount = docData._pdfInfo.numPages

    const pagePromises = Array.from({ length: pageCount }, (_, pageNumber) =>
      docData
        .getPage(pageNumber + 1)
        .then((pageData) =>
          pageData
            .getTextContent()
            .then((textContent) =>
              textContent.items.map(({ str }: any) => str).join(' ')
            )
        )
    )

    return Promise.all(pagePromises).then((p) => {
      setPages(p)
    })
  }, [file])

  useEffect(() => {
    handlePageLoad()
  }, [file, handlePageLoad])

  const RenderText = customRenderComponent ?? DefaultTextRenderer;

  return (
    // @ts-ignore
    <Document
      file={file}
      onLoadSuccess={(p) => {
        p.getPage(1).then((page) => {
          setPageSize({
            width: page.view[2],
            height: page.view[3]
          })
        })
      }}
    >
      {pages.map((_, i) => (
        <div key={
          Math.random().toString(36).substring(7)
        } className={styles.pageContainer} style={{ width }}>
          {/* @ts-ignore */}
          <Page
            renderTextLayer={false}
            width={width}
            pageNumber={i + 1}
            renderAnnotationLayer={false}
          />
          <div className={styles.overlayContent}>
            <div className={styles.ocrPage}>
              {ocrData[i + 1]?.map((block) => (
                <div key={block.Id} style={{
                  left: `${block.Geometry.BoundingBox.Left * width}px`,
                  top: `${block.Geometry.BoundingBox.Top * height}px`,
                  position: 'absolute',
                }}>
                  <RenderText {...block} width={width} height={height} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </Document>
  )
}

export default OCRPdfRenderer
