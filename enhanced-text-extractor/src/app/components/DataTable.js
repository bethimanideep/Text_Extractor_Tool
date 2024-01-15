import React from 'react';

const DataTable = ({ data }) => {
  // Implement your interactive table component here
  return (
    <div>
      <h2>Data Table</h2>
      {/* Display data in a tabular format */}
      <table>
        <thead>
          <tr>
            <th>Column 1</th>
            <th>Column 2</th>
            {/* Add more columns based on your data structure */}
          </tr>
        </thead>
        <tbody>
          {/* Map through data and display rows */}
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.column1}</td>
              <td>{row.column2}</td>
              {/* Add more cells based on your data structure */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
