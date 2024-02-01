import { Checkbox, Label } from "flowbite-react";
import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { FileUploadContainer } from "./file-upload/FileUploadContainer";

interface Props {
  readonly tools: string[];
  readonly selectedTools: string[];
  readonly selectTool: (tool: string) => void;
  readonly files: File[];
  readonly setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export const Tools: React.FC<Props> = ({
  tools,
  files,
  setFiles,
  selectTool,
  selectedTools,
}) => {
  useEffect(() => {
    if (files.length > 0) {
      selectTool("Retrieval");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm mb-2">
        Select the tools you want to use for your GPT. Be aware that GPT decide
        what tools to use on their own.
      </div>
      {tools.map((tool) => (
        <SingleTool
          tool={tool}
          onClick={selectTool}
          checked={selectedTools.includes(tool)}
          disabled={
            TOOL_DESCRIPTIONS[tool as keyof typeof TOOL_DESCRIPTIONS].disabled
          }
        />
      ))}

      <div className="mb-2 mt-2">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="instruction"
        >
          Knowledge
        </label>
        <p className="text-sm text-gray-600">
          If you upload files under Knowledge, conversations with your GPT may
          include file contents.
        </p>
        <FileUploadContainer files={files} setFiles={setFiles} />
      </div>
    </div>
  );
};

const SingleTool = ({
  tool,
  disabled,
  onClick,
  checked,
}: {
  tool: string;
  disabled: boolean;
  onClick: (tool: string) => void;
  checked: boolean;
}) => (
  <div className="flex mt-1 mb-1 gap-2">
    <div className="flex h-5 items-center">
      <Checkbox
        checked={checked}
        onChange={() => onClick(tool)}
        disabled={disabled}
        id={tool}
      />
    </div>
    <div className="flex flex-col">
      <Label
        disabled={disabled}
        className="disabled:text-gray-300"
        htmlFor={tool}
      >
        {tool}
      </Label>
      <div className="text-gray-500 dark:text-gray-300">
        <span className="text-xs font-normal">
          {Object.keys(TOOL_DESCRIPTIONS).map((key) => {
            if (key === tool) {
              return (
                <ReactMarkdown key={key}>
                  {
                    TOOL_DESCRIPTIONS[key as keyof typeof TOOL_DESCRIPTIONS]
                      .description
                  }
                </ReactMarkdown>
              );
            }
          })}
        </span>
      </div>
    </div>
  </div>
);

const TOOL_DESCRIPTIONS = {
  Retrieval: {
    description: "Look up information in uploaded files.",
    disabled: false,
  },
  "DDG Search": {
    description:
      "Search the web with [DuckDuckGo](https://pypi.org/project/duckduckgo-search/).",
    disabled: false,
  },
  "Search (Tavily)": {
    description:
      "Uses the [Tavily](https://app.tavily.com/) search engine. Includes sources in the response.",
    disabled: true,
  },
  "Search (short answer, Tavily)": {
    description:
      "Uses the [Tavily](https://app.tavily.com/) search engine. This returns only the answer, no supporting evidence.",
    disabled: true,
  },
  "You.com Search": {
    description:
      "Uses [You.com](https://you.com/) search, optimized responses for LLMs.",
    disabled: true,
  },
  "SEC Filings (Kay.ai)": {
    description:
      "Searches through SEC filings using [Kay.ai](https://www.kay.ai/).",
    disabled: false,
  },
  "Press Releases (Kay.ai)": {
    description:
      "Searches through press releases using [Kay.ai](https://www.kay.ai/).",
    disabled: false,
  },
  Arxiv: {
    description: "Searches [Arxiv](https://arxiv.org/).",
    disabled: false,
  },
  PubMed: {
    description: "Searches [PubMed](https://pubmed.ncbi.nlm.nih.gov/).",
    disabled: false,
  },
  Wikipedia: {
    description: "Searches [Wikipedia](https://pypi.org/project/wikipedia/).",
    disabled: false,
  },
};
