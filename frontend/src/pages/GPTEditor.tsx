import React, { useState } from "react";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { NavbarComponent } from "../components/NavBar";
import { FileUploadContainer } from "../components/file-upload/FileUploadContainer";
import { useConfigList } from "../hooks/useConfigList";
import { useSchemas } from "../hooks/useSchemas";
import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";

interface Props {}

interface FormValues {
  name: string;
  description: string;
  instruction: string;
}

export const GPTEditor: React.FC<Props> = () => {
  const navigate = useNavigate();
  const { configDefaults } = useSchemas();
  const { saveConfig } = useConfigList();

  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null); // New state for error handling

  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    description: "",
    instruction: "",
  });

  const goBack = () => {
    navigate(-1);
  };

  const createGPT = async () => {
    console.log("createGPT");
    if (configDefaults == null) {
      console.log("configDefaults is null");
      return;
    }

    const haveFiles = files.length > 0;

    // adjust config
    const config = {
      ...configDefaults,
      configurable: {
        ...configDefaults.configurable,
        "type==agent/system_message": formValues.instruction,
        tools: haveFiles ? ["Retrieval"] : [], // use only retrieval tool for now
      },
    };

    saveConfig(formValues.name, config, files, false)
      .then(() => {
        goBack();
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
      <div className="flex flex-1 justify-center items-center ">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl">
          <form>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                value={formValues.name}
                onChange={(evt) =>
                  setFormValues({
                    ...formValues,
                    name: evt.target.value,
                  })
                }
                required
                placeholder="Name your GPT"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                value={formValues.description}
                onChange={(evt) =>
                  setFormValues({
                    ...formValues,
                    description: evt.target.value,
                  })
                }
                rows={5}
                placeholder="Add a short description about what this GPT does."
              ></textarea>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="instruction"
              >
                Instructions
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="instruction"
                value={formValues.instruction}
                onChange={(evt) =>
                  setFormValues({
                    ...formValues,
                    instruction: evt.target.value,
                  })
                }
                rows={5}
                placeholder="What does this GPT do? How does it behave? What should it avoid doing?"
              ></textarea>
            </div>
            {/* More input fields here */}
            <div className="mb-2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="instruction"
              >
                Knowledge
              </label>
              <p className="text-sm text-gray-600">
                If you upload files under Knowledge, conversations with your GPT
                may include file contents.
              </p>
              <FileUploadContainer files={files} setFiles={setFiles} />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white disabled:bg-slate-400 disabled:cursor-not-allowed font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={createGPT}
                disabled={formValues.name == "" || formValues.instruction == ""}
              >
                Create GPT
              </button>
            </div>
            {error && <ErrorAlert />} {/* Display error message if error */}
          </form>
        </div>
      </div>
    </div>
  );
};

function ErrorAlert() {
  return (
    <Alert color="failure" className="mt-3" icon={HiInformationCircle}>
      <span className="font-medium">Error at Creating GPT!</span> There was an
      error at creating GPT, files could not be saved.
    </Alert>
  );
}
