"use client";
import { useState } from "react";
import FileUpload from "./components/FileUpload";

import DataTable from "./components/DataTable";
export default function Home() {
  const [showFile, setShowFile] = useState(true);
  const [fileData, setFileData] = useState(null);
  // Mock data for testing, replace with actual data
  console.log(showFile,fileData);
  return (
    <>
      {showFile ? (
        <FileUpload onShowTable={(data) => {setFileData(data);setShowFile(false);}} />
      ) : (
        <DataTable fileData={fileData} onClose={()=>{setShowFile(true)}} />
      )}
    </>
  );
}
