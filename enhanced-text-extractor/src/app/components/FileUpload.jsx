import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const FileUpload = ({ onShowTable }) => {
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    setLoading(true);

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("https://text-extractor-tool.vercel.app/api/extract-text", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Handle response, update state, or trigger further actions
      console.log(response.data, "this is my data");
      onShowTable(response.data.finaldata);
    } catch (error) {
      // Handle error, provide user feedback
      console.error("Error uploading file:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <center style={{marginTop:"40px"}}>
      <button className="button" role="button"> Text Extractor Tool!</button>

      </center>
      <div {...getRootProps()} className="mainfileupload">
        <input {...getInputProps()} />
        <div>
          {loading ? (
            <div>
              <svg className="pl" width="240" height="240" viewBox="0 0 240 240">
                <circle
                  className="pl__ring pl__ring--a"
                  cx="120"
                  cy="120"
                  r="105"
                  fill="none"
                  stroke="#000"
                  stroke-width="20"
                  stroke-dasharray="0 660"
                  stroke-dashoffset="-330"
                  stroke-linecap="round"
                ></circle>
                <circle
                  className="pl__ring pl__ring--b"
                  cx="120"
                  cy="120"
                  r="35"
                  fill="none"
                  stroke="#000"
                  stroke-width="20"
                  stroke-dasharray="0 220"
                  stroke-dashoffset="-110"
                  stroke-linecap="round"
                ></circle>
                <circle
                  className="pl__ring pl__ring--c"
                  cx="85"
                  cy="120"
                  r="70"
                  fill="none"
                  stroke="#000"
                  stroke-width="20"
                  stroke-dasharray="0 440"
                  stroke-linecap="round"
                ></circle>
                <circle
                  className="pl__ring pl__ring--d"
                  cx="155"
                  cy="120"
                  r="70"
                  fill="none"
                  stroke="#000"
                  stroke-width="20"
                  stroke-dasharray="0 440"
                  stroke-linecap="round"
                ></circle>
              </svg>
            </div>
          ) : (
            <>
              <div className="file-upload-form">
                <label htmlFor="file" className="file-upload-label">
                  <div className="file-upload-design">
                    <svg viewBox="0 0 640 512" height="1em">
                      <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"></path>
                    </svg>
                    <p>Drag and Drop</p>
                    <p>or</p>
                    <span className="browse-button">Browse file</span>
                  </div>
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
