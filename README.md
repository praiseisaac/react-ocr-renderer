# react-textract-renderer

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/react-textract-renderer.svg)](https://www.npmjs.com/package/react-textract-renderer) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-textract-renderer
```

## Usage

```tsx
import React, { Component } from 'react'

import ReactTextractRenderer from 'react-textract-renderer'
import 'react-textract-renderer/dist/index.css'

class Example extends Component {
  render() {
    return <ReactTextractRenderer
      file="./Mt Creek Trail Contract.pdf"
      type={FileType.PDF}
      textractJson={
        textractJson
      }
      highlightedBlockTypes={[BlockType.LINE]}
    />
  }
}
```

If you want to perform a search, you can add the `searchText` prop as a string or array of strings.
```tsx
import React, { Component } from 'react'

import ReactTextractRenderer, { FileType, BlockType } from 'react-textract-renderer'
import 'react-textract-renderer/dist/index.css'

class Example extends Component {
  render() {
    return <ReactTextractRenderer
      file="./Mt Creek Trail Contract.pdf"
      type={FileType.PDF}
      textractJson={
        textractJson
      }
      highlightedBlockTypes={[BlockType.LINE]}
      searchText={"test to search"}
      {/* searchText={["text1", "text2"]} */}
    />
  }
}
```

## License

MIT © [praiseisaac](https://github.com/praiseisaac)
