import React, { useEffect, useState } from "react";
import { FileUploadDropzone } from "./FileUpload";
import { useDropzone } from "react-dropzone";

interface Props {}

export const FileUploadContainer: React.FC<Props> = () => {
  const [files, setFiles] = useState<File[]>([]);
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
  });

  useEffect(() => {
    if (dropzone.acceptedFiles.length > 0) {
      setFiles((files) => [
        ...files.filter((f) => !dropzone.acceptedFiles.includes(f)),
        ...dropzone.acceptedFiles,
      ]);
    }
  }, [dropzone.acceptedFiles]);
  return (
    <FileUploadDropzone state={dropzone} files={files} setFiles={setFiles} />
  );
};
