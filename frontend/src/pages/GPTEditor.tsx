import { Button, Tabs, TabsRef } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { HiOutlineArrowLeft, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { NavbarComponent } from "../components/NavBar";
import { Tools } from "../components/Tools";
import { useConfigList } from "../hooks/useConfigList";
import { useSchemas } from "../hooks/useSchemas";
import { FormComponent } from "./gpt_editor/Form";

interface FormValues {
  name: string;
  description: string;
  instruction: string;
}

export const GPTEditor: React.FC<Props> = () => {
  const navigate = useNavigate();
  const { configDefaults, configSchema } = useSchemas();
  const { saveConfig } = useConfigList();

  const availableTools =
    configSchema?.properties?.configurable.properties["type==assistant/tools"]
      .items?.enum;

  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null); // New state for error handling
  const [isLoading, setisLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    description: "",
    instruction: "",
  });

  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  const selectTool = (tool: string) => {
    if (selectedTools.includes(tool)) {
      setSelectedTools(selectedTools.filter((t) => t !== tool));
    } else {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleClick = async () => {
    if (activeTab === 0) {
      setActiveTab(1);
      return;
    }

    setisLoading(true);
    if (configDefaults == null) {
      return;
    }

    // adjust config
    const config = {
      ...configDefaults,
      configurable: {
        ...configDefaults.configurable,
        "type==assistant/system_message": formValues.instruction,
        "type==chatbot/system_message": formValues.instruction,
        "type==chat_retrieval/system_message": formValues.instruction,
        "type==assistant/tools": selectedTools, // use only retrieval tool for now
      },
    };

    saveConfig(formValues.name, config, files, false)
      .then(() => {
        setisLoading(false);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to save config."); // Set error message
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex  flex-col ">
      <NavbarComponent
        customBrand={
          <div onClick={goBack} className="flex items-center">
            <HiOutlineArrowLeft className="h-5 w-5 mr-1" />
            <div>Back</div>
          </div>
        }
      />

      <div className="flex m-auto justify-center items-center bg-white p-8 rounded shadow-md w-full max-w-3xl ">
        <form className="w-full">
          <TabsComponent
            formValues={formValues}
            setFormValues={setFormValues}
            tools={availableTools || []}
            files={files}
            error={error}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setFiles={setFiles}
            selectTool={selectTool}
            selectedTools={selectedTools}
          />
          <Button
            disabled={
              formValues.name == "" || formValues.instruction == "" || isLoading
            }
            color="blue"
            isProcessing={isLoading}
            onClick={handleClick}
          >
            {activeTab === 0 ? "Next" : "Save GPT"}
          </Button>
        </form>
      </div>
    </div>
  );
};

interface Props {
  tools: string[];
  formValues: FormValues;
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  selectedTools: string[];
  selectTool: (tool: string) => void;
  error: string | null;
}

export const TabsComponent: React.FC<Props> = ({
  tools,
  formValues,
  setFormValues,
  files,
  setActiveTab,
  activeTab,
  setFiles,
  selectTool,
  selectedTools,
  error,
}) => {
  const tabsRef = useRef<TabsRef>(null);

  useEffect(() => {
    if (tabsRef.current) {
      tabsRef.current.setActiveTab(activeTab);
    }
  }, [activeTab]);

  return (
    <div className="flex flex-col gap-3">
      <Tabs
        aria-label="Default tabs"
        style="default"
        ref={tabsRef}
        tabIndex={activeTab}
        onActiveTabChange={(tab) => setActiveTab(tab)}
      >
        <Tabs.Item active title="General" icon={HiUserCircle}>
          <FormComponent
            formValues={formValues}
            setFormValues={setFormValues}
            error={error}
          />
        </Tabs.Item>
        <Tabs.Item title="Tools" icon={MdDashboard}>
          <Tools
            selectTool={selectTool}
            selectedTools={selectedTools}
            files={files}
            setFiles={setFiles}
            tools={tools || []}
          />
        </Tabs.Item>
      </Tabs>
    </div>
  );
};
