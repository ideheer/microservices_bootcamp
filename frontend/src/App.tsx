import { DataGrid, GridColDef } from "@mui/x-data-grid";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

interface AuthorData {
  id: number;
  name: string;
  bio: number;
}

function App() {
  const [data, setData] = useState<AuthorData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/authors");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "bio", headerName: "Bio", width: 110 },
  ];

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        hideFooter={false}
        hideFooterPagination={false}
        hideFooterSelectedRowCount={false}
        paginationMode={"client"}
        loading={loading}
      />
    </div>
  );
}

export default App;
