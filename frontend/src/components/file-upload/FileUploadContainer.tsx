import React, { useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FileUploadDropzone } from "./FileUpload";

interface Props {
  readonly files: File[];
  readonly setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  readonly onDropAccepted: (files: File[]) => void;
}

export const FileUploadContainer: React.FC<Props> = ({
  files,
  setFiles,
  onDropAccepted,
}) => {
  const dropzone = useDropzone({
    multiple: true,
    accept: {
      "text/*": [".txt", ".csv", ".htm", ".html"],
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/msword": [".doc"],
    },
    maxSize: 10_000_000, // Up to 10 MB file size.
    onDropAccepted,
  });

  useEffect(() => {
    if (dropzone.acceptedFiles.length > 0) {
      setFiles((files) => [
        ...files.filter((f) => !dropzone.acceptedFiles.includes(f)),
        ...dropzone.acceptedFiles,
      ]);
    }
  }, [dropzone.acceptedFiles, setFiles]);

  return (
    <FileUploadDropzone state={dropzone} files={files} setFiles={setFiles} />
  );
};
