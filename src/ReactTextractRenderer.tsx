import React, { useMemo } from "react";
import {
  BlockType,
  FileType,
  TextractBlock,
  TextractBlockRenderProps,
} from "./ReactTextractRenderer.types";
import TextractPdfRenderer from './components/TextractPdfRenderer/TextractPdfRenderer';

const groupPages = (blocks: TextractBlock[]) => {
  const pages: {
    [key: number]: TextractBlock[];
  } = {};

  blocks.forEach((block) => {
    pages[block.Page] = pages[block.Page] || [];

    pages[block.Page].push(block);
  });
  return pages;
};

const ReactTextractRenderer = ({
  file,
  type,
  textractJson,
  searchText = [],
  highlightedBlockTypes = [BlockType.WORD],
  customRenderComponent
}:  {
  file: string;
  type: FileType;
  textractJson: {
    Blocks: TextractBlock[];
    DocumentMetadata: {
      Pages: number;
    };
  };
  searchText?: string[] | string;
    highlightedBlockTypes?: BlockType[];
    customRenderComponent?: (props: TextractBlockRenderProps) => JSX.Element;
}) => {
  const cleanedSearchText = useMemo(
    () =>
      typeof searchText === "string"
        ? searchText.toLowerCase()
        : searchText.map((el) => el.toLowerCase()),
    [searchText],
  );

  const filteredBlocks = useMemo(
    () =>
      textractJson.Blocks.filter((block) => {
        if (!highlightedBlockTypes.includes(block.BlockType)) {
          return false;
        }

        const textCheck =
          typeof cleanedSearchText === "string"
            ? !block.Text.toLowerCase().includes(cleanedSearchText)
            : !cleanedSearchText.some((el) =>
                !block.Text ? false : block.Text.toLowerCase().includes(el),
              );

        if (cleanedSearchText.length && textCheck) {
          return false;
        }

        return true;
      }),
    [textractJson, cleanedSearchText, highlightedBlockTypes],
  );

  if (type === FileType.PDF) {
    const pageGroups = groupPages(filteredBlocks);

    return (
      <TextractPdfRenderer
        file={file}
        textractData={pageGroups}
        customRenderComponent={customRenderComponent}
      />
    );
  }

  return <div>{file}</div>;
};

export default ReactTextractRenderer;
