import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo
} from 'react'
import { OCRBlock, OCRPageGroup } from '../ReactOCRRenderer.types'

export type ReactOCRRendererContextType = {
  pages: OCRPageGroup
  setPages: (pages: OCRPageGroup) => void
  scrollToBlock: (index: number) => void
  nextBlock: () => void
  prevBlock: () => void
  currentBlock: OCRBlock | undefined
  blockIds: string[]
  scrollToBlockId: (blockId: string) => void
}

const ReactOCRRendererContext = createContext<
  ReactOCRRendererContextType | undefined
>(undefined)

enum ActionType {
  SET_PAGES = 'SET_PAGES',
  SET_CURRENT_BLOCK = 'SET_CURRENT_BLOCK',
  SET_CURRENT_BLOCK_INDEX = 'SET_CURRENT_BLOCK_INDEX'
}

const reducer = (
  state: {
    pages: OCRPageGroup
    currentBlock: OCRBlock | undefined
    currentBlockIndex: number
  },
  action: {
    type: ActionType
    payload: OCRPageGroup | OCRBlock | number
  }
) => {
  switch (action.type) {
    case ActionType.SET_PAGES:
      return {
        ...state,
        pages: action.payload as OCRPageGroup
      }
    case ActionType.SET_CURRENT_BLOCK:
      return {
        ...state,
        currentBlock: action.payload as OCRBlock
      }
    case ActionType.SET_CURRENT_BLOCK_INDEX:
      return {
        ...state,
        currentBlockIndex: action.payload as number
      }
    default:
      return state
  }
}

export const useReactOCRRenderer = () => {
  const [{ pages, currentBlock, currentBlockIndex }, dispatch] =
    React.useReducer(reducer, {
      pages: {} as OCRPageGroup,
      currentBlock: undefined,
      currentBlockIndex: 0
    })

  const context = useContext(ReactOCRRendererContext)

  const scrollToBlockId = (blockId: string) => {
    setTimeout(() => {
      const block = document.getElementById(blockId)

      if (block) {
        block.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'center'
        })
      }
    }, 250)
  }

  const [blocks, blockIds] = useMemo<
    [
      {
        [key: string]: OCRBlock
      },
      string[]
    ]
  >(
    () =>
      Object.values(pages).reduce(
        (acc, val) => {
          val.forEach((block) => {
            acc[0][block.Id] = block
            acc[1].push(block.Id)
          })

          return acc
        },
        [
          {} as {
            [key: string]: OCRBlock
          },
          [] as string[]
        ]
      ),
    [pages]
  )

  useEffect(() => {
    if (!blockIds.length) return

    dispatch({
      type: ActionType.SET_CURRENT_BLOCK,
      payload: blocks[blockIds[currentBlockIndex]]
    })
  }, [blockIds])

  const scrollToBlock = useCallback(
    (index: number) => {
      if (!blockIds.length) return

      dispatch({
        type: ActionType.SET_CURRENT_BLOCK_INDEX,
        payload: index
      })
    },
    [blockIds]
  )

  const nextBlock = useCallback(() => {
    dispatch({
      type: ActionType.SET_CURRENT_BLOCK_INDEX,
      payload:
        currentBlockIndex === blockIds.length - 1 ? 0 : currentBlockIndex + 1
    })
  }, [blockIds, currentBlockIndex])

  useEffect(() => {
    dispatch({
      type: ActionType.SET_CURRENT_BLOCK,
      payload: blocks[blockIds[currentBlockIndex]]
    })
  }, [currentBlockIndex])

  useEffect(() => {
    if (!currentBlock) return

    scrollToBlockId(currentBlock.Id)
  }, [currentBlock])

  const prevBlock = useCallback(() => {
    dispatch({
      type: ActionType.SET_CURRENT_BLOCK_INDEX,
      payload:
        currentBlockIndex === 0 ? blockIds.length - 1 : currentBlockIndex - 1
    })
  }, [blockIds, currentBlockIndex])

  const setPages = useCallback((pages: OCRPageGroup) => {
    dispatch({
      type: ActionType.SET_PAGES,
      payload: pages
    })
  }, [])

  const contextPreset = useMemo(
    () => ({
      pages,
      setPages,
      scrollToBlock,
      nextBlock,
      prevBlock,
      currentBlock,
      blockIds,
      scrollToBlockId
    }),
    [
      pages,
      setPages,
      currentBlock,
      blockIds,
      scrollToBlock,
      nextBlock,
      prevBlock
    ]
  )

  return context ?? contextPreset
}

export const ReactOCRRendererContextProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const value = useReactOCRRenderer()

  return (
    <ReactOCRRendererContext.Provider value={value}>
      {children}
    </ReactOCRRendererContext.Provider>
  )
}
