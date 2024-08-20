import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import "./App.css";

const rows: GridRowsProp = [
  { id: 1, col1: "1", col2: "One" },
  { id: 2, col1: "2", col2: "Two" },
  { id: 3, col1: "3", col2: "Three" },
];

const columns: GridColDef[] = [
  { field: "col1", headerName: "Key", width: 200 },
  { field: "col2", headerName: "Value", width: 200 },
];

function App() {
  return (
    <div style={{ height: 300, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        hideFooter={false}
        hideFooterPagination={false}
        hideFooterSelectedRowCount={false}
      />
    </div>
  );
}

export default App;
