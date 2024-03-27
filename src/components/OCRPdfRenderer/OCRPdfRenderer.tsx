import React, { useCallback, useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import {
  OCRBlock,
  OCRBlockRenderProps,
  OCRPageRenderProps
} from '../../ReactOCRRenderer.types'
import DefaultPageRender from '../DefaultPageRender/DefaultPageRender'
import OCROverlayRenderer from '../OCROverlayRenderer/OCROverlayRenderer'
import styles from './OCRPdfRenderer.module.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

const OCRPdfRenderer = ({
  file,
  ocrData = [],
  customTextRenderComponent,
  customPageRenderComponent,
  size = {
    width: 500
  },
  showOnlyResultPages = false,
  showOCROverlay = true
}: {
  file: string
  ocrData: {
    [key: number]: OCRBlock[]
  }
  customTextRenderComponent?: (props: OCRBlockRenderProps) => JSX.Element
  customPageRenderComponent?: (props: OCRPageRenderProps) => JSX.Element
  size?: {
    width: number
  }
  showOnlyResultPages?: boolean
  showOCROverlay?: boolean
}) => {
  const [pages, setPages] = useState<string[]>([])
  const [{ width, height }, setPageSize] = useState<{
    width: number
    height: number
  }>({
    width: size.width,
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
              textContent.items.map((v) => (v as { str: string }).str).join(' ')
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

  const RenderPage = customPageRenderComponent ?? DefaultPageRender

  const rootList = Object.keys(showOnlyResultPages ? ocrData : pages)

  return (
    <Document
      file={file}
      onLoadSuccess={(p) => {
        p.getPage(1).then((page) => {
          setPageSize({
            width: width || size.width,
            height: width * (page.view[3] / page.view[2])
          })
        })
      }}
    >
      {rootList.map((pString) => {
        const i = parseInt(pString, 10)

        return (
          <div
            key={Math.random().toString(36).substring(7)}
            className={styles.pageContainer}
            style={{
              width
            }}
          >
            <RenderPage page={i} blocks={ocrData[i] ?? []}>
              <Page
                renderTextLayer={false}
                width={width}
                pageNumber={i}
                renderAnnotationLayer={false}
              />
              {showOCROverlay && (
                <OCROverlayRenderer
                  blocks={ocrData[i] ?? []}
                  width={width}
                  height={height}
                  customTextRenderComponent={customTextRenderComponent}
                />
              )}
            </RenderPage>
          </div>
        )
      })}
    </Document>
  )
}

export default OCRPdfRenderer
