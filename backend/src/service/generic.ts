import { Author } from "../model/author";
import NotFoundError from "../errors/errors";
import Book from "../model/book";
import pg from "pg";

export type ModelConstructor<T> = new (payload: any) => T;

export function genericService<T>(
  connection: pg.Pool,
  tableName: string,
  ModelClass: ModelConstructor<T>
) {
  const create = async (payload: any): Promise<T> => {
    const payloadKeys = Object.keys(payload); // ['publisheddate', 'summary', 'title', 'authorid']
    const payloadValues = Object.values(payload); // ['2024-08-12', 'Very good book', 'Name of the Wind', '4']

    try {
      // "INSERT INTO public.authors(name, bio) VALUES ($1, $2) RETURNING *;"
      // "INSERT INTO public.books(title, publisheddate, authorid, summary) VALUES ($1, $2, $3, $4) RETURNING *",

      const payloadValuesArray = payloadValues.map((value) => {
        // 2024-08-12, Very good book, Name of the Wind, 4
        return "'" + value + "'"; // '2024-08-12', 'Very good book', 'Name of the Wind', '4'
      });

      const commaSeparatedFieldNames = payloadKeys.join(", "); // publisheddate, summary, title, authorid
      const commaSeparatedFieldValues = payloadValuesArray.join(", "); // '2024-08-12', 'Very good book', 'Name of the Wind', '4'

      let query = `INSERT INTO public.${tableName}(${commaSeparatedFieldNames}) VALUES (${commaSeparatedFieldValues}) RETURNING *;`;

      const result = await connection.query(query);
      // console.log(result);
      const created = new ModelClass(result.rows[0]) as Author | Book;
      created.validate();

      return created as T;
    } catch (error) {
      // console.log(error);
      throw error;
    }
  };

  const get = async (id: string) => {
    // console.log(tableName);
    let query = `SELECT * from ${tableName} WHERE id=${id} `;
    // console.log(query);
    const result = await connection.query(
      // "SELECT * FROM authors WHERE id = $1;",
      // [authorId]
      query
    );

    if (result.rows.length == 0) {
      throw new NotFoundError("Not found.");
    } else {
      const got = new ModelClass(result.rows[0]);
      return got;
    }
  };

  const update = async (payload: any) => {
    const updateFields = Object.entries(payload)
      .filter(([key]) => key !== "id")
      .map(([key, value]) => `${key}='${value}'`)
      .join(", ");
    let query = `UPDATE public.${tableName} SET ${updateFields} WHERE id=${payload.id} RETURNING *;`;

    try {
      const result = await connection.query(
        query
        // "UPDATE public.authors SET name=$1, bio=$2 WHERE id=$3 RETURNING *;",
        // [name, bio, id]
      );
      const updated = new ModelClass(result.rows[0]) as Author | Book;
      updated.validate();
      return updated;
    } catch (error) {
      throw error;
    }
  };

  interface PaginationParams {
    page: number;
    pageSize: number;
  }

  const getAll = async ({ page, pageSize }: PaginationParams): Promise<T> => {
    try {
      const offset = page * pageSize;
      let dataQuery = `SELECT * FROM ${tableName} ORDER BY id LIMIT $1 OFFSET $2;`;
      let totalQuery = `SELECT COUNT(*) AS cnt FROM ${tableName}`;

      const dataResult = await connection.query(dataQuery, [pageSize, offset]);
      const totalResult = await connection.query(totalQuery);

      const entityList = [];
      for (const obj of dataResult.rows) {
        const newEntity = new ModelClass(obj) as Author | Book;
        newEntity.validate();
        entityList.push(newEntity);
      }

      const responseObject = {
        total: parseInt(totalResult.rows[0]["cnt"]),
        data: entityList,
      };
      return responseObject as T;
    } catch (error) {
      throw error;
    }
  };

  const service = {
    create,
    get,
    getAll,
    update,
  };
  return service;
}
