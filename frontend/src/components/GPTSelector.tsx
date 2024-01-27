import { Dropdown } from "flowbite-react";
import React, { useState } from "react";
import { Config } from "../hooks/useConfigList";

interface Props {
  readonly gpts: Config[];
  readonly onSelect: (gpt: Config) => void;
}

export const GPTSelector: React.FC<Props> = ({ gpts, onSelect }) => {
  const [selectedGPTIndex, setselectedGPTIndex] = useState(0);

  const onGPTSelect = (index: number, gpt: Config) => {
    setselectedGPTIndex(index);
    onSelect(gpt);
  };

  const label = gpts[selectedGPTIndex]?.name ?? "Select GPT";

  return (
    <Dropdown label={label} inline dismissOnClick={false}>
      {gpts.map((gpt, index) => (
        <Dropdown.Item
          onClick={() => onGPTSelect(index, gpt)}
          key={gpt.assistant_id}
        >
          {gpt.name}
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
};
