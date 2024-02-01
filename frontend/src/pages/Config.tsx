import { noop } from "lodash";
import React from "react";
import { useSchemas } from "../hooks/useSchemas";
import { useConfigList } from "../hooks/useConfigList";
import { NewChat } from "../components/NewChat";

interface Props {}

export const ConfigPage: React.FC<Props> = () => {
  const { configSchema } = useSchemas();
  const { configs, enterConfig, currentConfig } = useConfigList();
  return (
    <NewChat
      startChat={noop}
      configSchema={configSchema}
      configDefaults={null}
      configs={configs}
      currentConfig={currentConfig}
      saveConfig={noop}
      enterConfig={enterConfig}
    />
  );
};
