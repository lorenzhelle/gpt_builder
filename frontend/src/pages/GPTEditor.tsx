import { Alert, Button, Tabs, TabsRef } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import {
  HiInformationCircle,
  HiOutlineArrowLeft,
  HiUserCircle,
  HiTrash,
} from "react-icons/hi";
import { BiSave } from "react-icons/bi";

import { MdDashboard } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { NavbarComponent } from "../components/NavBar";
import { Tools } from "../components/Tools";
import { useConfigList } from "../hooks/useConfigList";
import { useSchemas } from "../hooks/useSchemas";
import { FormComponent } from "./gpt_editor/Form";
import { ConfirmModal } from "../components/ConfirmModal";

interface FormValues {
  name: string;
  description: string;
  instruction: string;
}

export const GPTEditor: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();

  const { configDefaults, configSchema } = useSchemas();
  const { saveConfig, configs, deleteConfig } = useConfigList();

  const currentConfig = configs?.find(
    (config) => config.assistant_id == params.id
  );

  const isEdit = currentConfig != null;

  const availableTools =
    configSchema?.properties?.configurable.properties["type==assistant/tools"]
      .items?.enum;

  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null); // New state for error handling
  const [isLoading, setisLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isSaveChangesDisabled, setisSaveChangesDisabled] = useState(true);
  const [isConfirmModalOpen, setisConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (currentConfig) {
      const selectedTools = currentConfig.config.configurable?.[
        "type==assistant/tools"
      ] as string[];

      setSelectedTools(selectedTools);

      setFormValues((prev) => ({
        ...prev,
        name: currentConfig.name,
        description: currentConfig.description,
        instruction:
          (currentConfig.config.configurable?.[
            "type==assistant/system_message"
          ] as string) ?? "",
      }));
    }
  }, [currentConfig]);

  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    description: "",
    instruction: "",
  });

  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  const selectTool = (tool: string) => {
    setisSaveChangesDisabled(false);
    if (selectedTools.includes(tool)) {
      setSelectedTools(selectedTools.filter((t) => t !== tool));
    } else {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleSetFormValues = (values: FormValues) => {
    setisSaveChangesDisabled(false);
    setFormValues(values);
  };

  const handleDelete = () => {
    if (currentConfig == null) {
      return;
    }
    deleteConfig(currentConfig?.assistant_id).then(() => {
      navigate("/");
    });
  };

  const handleSaveChanges = () => {
    setisSaveChangesDisabled(true);

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

    saveConfig(
      formValues.name,
      config,
      files,
      true,
      formValues.description,
      currentConfig?.assistant_id
    )
      .then(() => {
        setisLoading(false);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to update config."); // Set error message
      });
  };

  const handleCreate = async () => {
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

    saveConfig(formValues.name, config, files, false, formValues.description)
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
      <div className="flex m-auto justify-center flex-col items-center bg-white p-8 rounded shadow-md w-full max-w-3xl ">
        <form className="w-full">
          {isEdit && (
            <div className="flex justify-end">
              <Button
                color="failure"
                onClick={() => setisConfirmModalOpen(true)}
              >
                <HiTrash className="mr-2 h-5 w-5" />
                Delete GPT
              </Button>
            </div>
          )}
          <TabsComponent
            formValues={formValues}
            setFormValues={handleSetFormValues}
            tools={availableTools || []}
            files={files}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setFiles={setFiles}
            selectTool={selectTool}
            selectedTools={selectedTools}
          />
          {error && <ErrorAlert />} {/* Display error message if error */}
          <div className="flex justify-between">
            {!(activeTab === 1 && isEdit) && (
              <Button
                disabled={
                  formValues.name == "" ||
                  formValues.instruction == "" ||
                  isLoading
                }
                isProcessing={isLoading}
                onClick={handleCreate}
              >
                {activeTab === 0 ? "Next" : "Save GPT"}
              </Button>
            )}
            {isEdit && (
              <Button
                onClick={handleSaveChanges}
                disabled={isSaveChangesDisabled}
              >
                <BiSave className="mr-2 h-5 w-5" />
                Save Changes
              </Button>
            )}
          </div>
        </form>
      </div>

      <ConfirmModal
        setOpenModal={setisConfirmModalOpen}
        openModal={isConfirmModalOpen}
        onConfirm={handleDelete}
      />
    </div>
  );
};

interface TabsProps {
  tools: string[];
  formValues: FormValues;
  setFormValues: (values: FormValues) => void;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  selectedTools: string[];
  selectTool: (tool: string) => void;
}

export const TabsComponent: React.FC<TabsProps> = ({
  tools,
  formValues,
  setFormValues,
  files,
  setActiveTab,
  activeTab,
  setFiles,
  selectTool,
  selectedTools,
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

function ErrorAlert() {
  return (
    <Alert color="failure" className="mt-1 mb-2" icon={HiInformationCircle}>
      <span className="font-medium">Error at Creating GPT!</span> There was an
      error at creating GPT, files could not be saved.
    </Alert>
  );
}
