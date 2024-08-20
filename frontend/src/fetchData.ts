import axios from "axios";
import { AuthorData } from "./types";

interface FetchAuthorDataParams {
  page: number;
  pageSize: number;
}

export const fetchAuthorData = async ({
  page,
  pageSize,
}: FetchAuthorDataParams): Promise<{ data: AuthorData[]; total: number }> => {
  // Simulate an API call
  const response = await axios.get("http://localhost:3000/authors", {
    params: {
      page,
      pageSize,
    },
  });

  return {
    data: response.data,
    total: 100, // we don't have a good structure to provide metadata
  };
};
