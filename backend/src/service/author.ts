import { Author, AuthorListing } from "../model/author";
import NotFoundError from "../errors/errors";
import pg from "pg";
import { AuthorPayload } from "../types/payloads";

let dbConnection: pg.Pool;

// Deprecated
const createAuthor = async ({ name, bio }: AuthorPayload): Promise<Author> => {
  try {
    const result = await dbConnection.query(
      "INSERT INTO public.authors(name, bio) VALUES ($1, $2) RETURNING *;",
      [name, bio]
    );
    const createdAuthor = new Author(result.rows[0]);
    createdAuthor.validate();
    return createdAuthor;
  } catch (error) {
    throw error;
  }
};

// Deprecated
// const getAllAuthors = async () => {
//   try {
//     const result = await dbConnection.query(
//       "SELECT name, id FROM authors order by id;"
//     );
//     const authorList = [];

//     for (const currentRow of result.rows) {
//       const authorListing = new AuthorListing(currentRow);
//       authorList.push(authorListing);
//     }
//     return authorList;
//   } catch (error) {
//     throw error;
//   }
// };

// TODO(@unnamedsunshine): port this to generic.ts
const getAuthor = async (authorId: string) => {
  const result = await dbConnection.query(
    "SELECT * FROM authors WHERE id = $1;",
    [authorId]
  );
  if (result.rows.length == 0) {
    throw new NotFoundError("Not found.");
  } else {
    const author = new Author(result.rows[0]);
    return author;
  }
};

//TODO(@unnamedsunshine)
const updateAuthor = async ({ name, bio, id }: AuthorPayload) => {
  try {
    const result = await dbConnection.query(
      "UPDATE public.authors SET name=$1, bio=$2 WHERE id=$3 RETURNING *;",
      [name, bio, id]
    );
    const updatedAuthor = new Author(result.rows[0]);
    updatedAuthor.validate();
    return updatedAuthor;
  } catch (error) {
    throw error;
  }
};

const deleteAuthor = async (authorId: string) => {
  try {
    const result = await dbConnection.query(
      "DELETE FROM public.authors WHERE id=$1;",
      [authorId]
    );
    if (result.rowCount == 0) {
      throw new NotFoundError("Not Found");
    }
    return result.rowCount == 1 ? true : false;
  } catch (error) {
    throw error;
  }
};

export default function authorService(connection: pg.Pool) {
  dbConnection = connection;
  const service = {
    create: createAuthor,
    delete: deleteAuthor,
    get: getAuthor,
    update: updateAuthor,
  };
  return service;
}
