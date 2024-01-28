import { Dropdown } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Config } from "../hooks/useConfigList";
import { HiPlusCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

interface Props {
  readonly gpts: Config[];
  readonly onSelect: (gpt: Config) => void;
}

export const GPTSelector: React.FC<Props> = ({ gpts, onSelect }) => {
  const [selectedGPTIndex, setselectedGPTIndex] = useState(0);

  const navgiate = useNavigate();

  useEffect(() => {
    if (gpts.length > 0) {
      onSelect(gpts[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gpts.length]);

  const onGPTSelect = (index: number, gpt: Config) => {
    setselectedGPTIndex(index);
    onSelect(gpt);
  };

  const onGPTCreate = () => {
    console.log("create gpt");
    navgiate("/editor");
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

      <Dropdown.Divider />
      <Dropdown.Item onClick={onGPTCreate} icon={HiPlusCircle}>
        Create GPT
      </Dropdown.Item>
    </Dropdown>
  );
};
