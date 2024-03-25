import React, { Fragment } from 'react'
import { OCRPageRenderProps } from '../../ReactOCRRenderer.types'

const DefaultPageRender = (props: OCRPageRenderProps) => {
  return <Fragment>{props.children}</Fragment>
}

export default DefaultPageRender
