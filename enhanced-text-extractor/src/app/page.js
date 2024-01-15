import DataTable from "./components/DataTable"
import FileUpload from "./components/FileUpload";


export default function Home() {
  // Mock data for testing, replace with actual data
  const mockData = [
    { column1: 'Value 1', column2: 'Value 2' },
    // Add more rows based on your data structure
  ];

  return (
    <div>
      <h1>Enhanced Text Extractor</h1>
      <FileUpload />
      <DataTable data={mockData} />
    </div>
  );
}
