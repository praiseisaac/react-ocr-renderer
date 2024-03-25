# react-ocr-renderer

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/react-ocr-renderer.svg)](https://www.npmjs.com/package/react-ocr-renderer) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-ocr-renderer
```

## Usage

```tsx
import React, { Component } from 'react'

import ReactOCRRenderer, { FileType, BlockType } from 'react-ocr-renderer'
import 'react-ocr-renderer/dist/index.css'

const ocrData = {
  Blocks: [
    {
      BlockType: BlockType.LINE,
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
      Relationships: [],
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

class Example extends Component {
  render() {
    return <ReactOCRRenderer
      file="path/to/file"
      type={FileType.PDF}
      ocrData={
        ocrData
      }
      highlightedBlockTypes={[BlockType.LINE]}
    />
  }
}
```

If you want to perform a search, you can add the `searchText` prop as a string or array of strings.
```tsx
import React, { Component } from 'react'

import ReactOCRRenderer, { FileType, BlockType } from 'react-ocr-renderer'
import 'react-ocr-renderer/dist/index.css'


const ocrData = {
  Blocks: [
    {
      BlockType: BlockType.LINE,
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
      Relationships: [],
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

class Example extends Component {
  render() {
    return <ReactOCRRenderer
      file="path/to/file"
      type={FileType.PDF}
      ocrData={
        ocrData
      }
      highlightedBlockTypes={[BlockType.LINE]}
      searchText={"test to search"}
      {/* searchText={["text1", "text2"]} */}
    />
  }
}
```

## [To-Dos](https://praisedaramola.notion.site/ReactOCRRenderer-4d8b93487d0b438ca4d0a406158c819c)

## License

MIT © [praiseisaac](https://github.com/praiseisaac)
