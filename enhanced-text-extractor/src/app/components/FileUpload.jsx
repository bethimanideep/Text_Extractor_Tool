"use client";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const FileUpload = () => {
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/extract-text", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Handle response, update state, or trigger further actions
      console.log(response.data);
    } catch (error) {
      // Handle error, provide user feedback
      console.error("Error uploading file:", error.message);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div>
        <button>Drag & drop a file here, or click to select a file</button>
      </div>
    </div>
  );
};

export default FileUpload;
