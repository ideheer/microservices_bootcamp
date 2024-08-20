import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { fetchAuthorData } from "../fetchData";
import { AuthorData } from "../types";

const AuthorTable: React.FC = () => {
  const [authors, setAuthors] = useState<AuthorData[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });
  const [rowCount, setRowCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadAuthors = async () => {
      setLoading(true);
      const { data, total } = await fetchAuthorData({
        page: paginationModel.page,
        pageSize: paginationModel.pageSize,
      });
      setAuthors(data);
      setRowCount(total);
      setLoading(false);
    };

    loadAuthors();
  }, [paginationModel]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "bio", headerName: "Bio", width: 250 },
  ];

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        rows={authors}
        columns={columns}
        paginationMode="server"
        rowCount={rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={(model) => setPaginationModel(model)}
        loading={loading}
      />
    </div>
  );
};

export default AuthorTable;
