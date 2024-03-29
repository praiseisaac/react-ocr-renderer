# React OCR Renderer

The React OCR Renderer is a React library designed for rendering OCR (Optical Character Recognition) data on top of documents.

## Features

- **PDF Rendering**: Renders PDF files and overlays OCR data on top of them.
- **Customizable Text and Page Rendering**: Allows for custom rendering of text blocks and pages.
- **Search and Highlight**: Supports searching text within the OCR data and highlighting matches.
- **Navigation**: Provides methods to navigate through text blocks (next, previous).

## Installation

To install the React OCR Renderer, run the following command:

```bash
npm install --save react-ocr-renderer
```

## Usage

### Basic Usage

To use the React OCR Renderer, import the `ReactOCRRenderer` component, and provide it with the PDF file path and OCR data.

```tsx
import React from 'react'
import ReactOCRRenderer from 'react-ocr-renderer'
import 'react-ocr-renderer/dist/index.css'

const ocrData = {
  Blocks: [
    {
      BlockType: 'LINE',
      Geometry: {
        BoundingBox: {
          Width: 0.5,
          Height: 0.1,
          Left: 0.25,
          Top: 0.3
        },
        Polygon: [
          { X: 0.25, Y: 0.3 },
          { X: 0.75, Y: 0.3 },
          { X: 0.75, Y: 0.4 },
          { X: 0.25, Y: 0.4 }
        ]
      },
      Id: "1",
      Page: 1,
      Confidence: 99,
      Text: "Sample text here"
    }
    // ...more blocks
  ],
  DocumentMetadata: {
    Pages: 1
  }
}

const App = () => {
  return (
    <ReactOCRRenderer
      file="path/to/your/file.pdf"
      ocrData={ocrData}
      type={FileType.PDF}
      highlightedBlockTypes={[BlockType.LINE]}
    />
  )
}
```

## Advanced Usage

The React OCR Renderer supports advanced features such as search functionality, custom render components, and navigation through OCR blocks. Below are examples demonstrating how to leverage these capabilities.

### Search Functionality

You can add the `searchText` prop to highlight and navigate through search results. This prop accepts either a string or an array of strings.

```tsx
import React from 'react'
import ReactOCRRenderer, { FileType, BlockType } from 'react-ocr-renderer'
import 'react-ocr-renderer/dist/index.css'

const ocrData = {
  // Your OCR data structure
}

const App = () => {
  return (
    <ReactOCRRenderer
      file="path/to/your/file.pdf"
      ocrData={ocrData}
      searchText="Sample text"
      highlightedBlockTypes={[BlockType.LINE]}
    />
  )
}
```

### Custom Render Components

For custom rendering of text blocks and pages, you can use `customTextRenderComponent` and `customPageRenderComponent` props.

```tsx
import React from 'react'
import ReactOCRRenderer from 'react-ocr-renderer'
import 'react-ocr-renderer/dist/index.css'

const CustomTextComponent = ({ block }) => (
  <div style={{ color: 'red' }}>{block.Text}</div>
)

const CustomPageComponent = ({ children, page }) => (
  <div>
    <h2>Page {page}</h2>
    {children}
  </div>
)

const ocrData = {
  // Your OCR data structure
}

const App = () => {
  return (
    <ReactOCRRenderer
      file="path/to/your/file.pdf"
      ocrData={ocrData}
      type={FileType.PDF}
      customTextRenderComponent={CustomTextComponent}
      customPageRenderComponent={CustomPageComponent}
    />
  )
}
```

### Navigation Through OCR Blocks

To navigate through OCR blocks, wrap your component in `ReactOCRRendererContextProvider` and use the `useReactOCRRenderer` hook.

```tsx
import React from 'react'
import ReactOCRRenderer, { ReactOCRRendererContextProvider, useReactOCRRenderer, FileType, BlockType } from 'react-ocr-renderer'
import 'react-ocr-renderer/dist/index.css'

const ContextCoveredExample = () => {
  const { nextBlock, prevBlock } = useReactOCRRenderer()

  return (
    <div>
      <ReactOCRRenderer
        file="path/to/file.pdf"
        ocrData={/* Your OCR data */}
        type={FileType.PDF}
        highlightedBlockTypes={[BlockType.LINE]}
      />
      <div>
        <button onClick={prevBlock}>Previous</button>
        <button onClick={nextBlock}>Next</button>
      </div>
    </div>
  )
}

const App = () => {
  return (
    <ReactOCRRendererContextProvider>
      <ContextCoveredExample />
    </ReactOCRRendererContextProvider>
  )
}
```

## Contributing

Contributions are welcome! Please refer to the project's [issues](https://github.com/praiseisaac/react-ocr-renderer/issues) on GitHub for areas where you can help.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.