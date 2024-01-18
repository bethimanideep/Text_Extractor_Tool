import React from "react";

function DataTable({ fileData, onClose }) {
  console.log(fileData, "this is table data");
  let filteredData;
  let tableRows;
  // Filter out properties with empty or non-string values
  if (fileData) {
    filteredData = Object.fromEntries(
      Object.entries(fileData).filter(
        ([_, value]) => typeof value === "string" && value.trim() !== ""
      )
    );

    tableRows = Object.entries(filteredData).map(([key, value]) => (
      <tr key={key}>
        <td>{key}</td>
        <td>{value}</td>
      </tr>
    ));
  }

  return (
    <div>
      <div
        style={{ display: "flex", justifyContent: "center", margin: "50px 0" }}
      >
        <div>
          <button className="button" onClick={onClose}>
            Go Back
            <svg fill="currentColor" viewBox="0 0 24 24" className="icon">
              <path
                clipRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                fillRule="evenodd"
              ></path>
            </svg>
          </button>{" "}
        </div>
      </div> 
      <div className="main">
        {fileData && Object.keys(filteredData).length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>{tableRows}</tbody>
          </table>
        ) : (
          <p>No data to display</p>
        )}
      </div>
    </div>
  );
}

export default DataTable;
