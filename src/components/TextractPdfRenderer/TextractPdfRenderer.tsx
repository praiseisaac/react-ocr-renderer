import React, { useCallback, useEffect, useState } from 'react'
import { pdfjs, Document, Page } from 'react-pdf'
import styles from './TextractPdfRenderer.module.css'
import { TextractBlock, TextractBlockRenderProps } from '../../ReactTextractRenderer.types'
import DefaultTextRenderer from '../DefaultTextRender/DefaultTextRenderer';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;


const TextractPdfRenderer = ({
  file,
  textractData,
  customRenderComponent
}: {
  file: string
  textractData: {
    [key: number]: TextractBlock[]
  },
  customRenderComponent?: (props: TextractBlockRenderProps) => JSX.Element
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
            <div className={styles.textractPage}>
              {textractData[i + 1]?.map((block) => <RenderText key={block.Id} {...block} width={width} height={height} />)}
            </div>
          </div>
        </div>
      ))}
    </Document>
  )
}

export default TextractPdfRenderer
