import React from "react";
import { FileUploadContainer } from "../components/file-upload/FileUploadContainer";

interface Props {}

export const GPTEditor: React.FC<Props> = () => {
  // const { configSchema, configDefaults } = useSchemas();
  // const { configs, currentConfig, saveConfig, enterConfig } = useConfigList();

  // console.log("configSchema:", configSchema);

  return (
    <div>
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
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
                rows={5}
                placeholder="What does this GPT do? How does it behave? What should it avoid doing?"
              ></textarea>
            </div>
            {/* More input fields here */}
            <KnowledgeUpload />
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                Create GPT
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const KnowledgeUpload = () => {
  return (
    <div className="mb-2">
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
      <FileUploadContainer />
    </div>
  );
};
