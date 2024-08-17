import { Author } from "../model/author";
import Book from "../model/book";
import pg from "pg";

/*
// OLD CODE
const authorService = authorService(dbConnection);
const createdAuthor = await authorService.create(authorPayload);

// NEW CODE
const service = genericService<Author>(dbConnection, "authors", Author);
const createdAuthor = await service.create(authorPayload);

const service = genericService<Book>(dbConnection, "books", Book);
const createdBooks = await service.create(bookPayload);
*/

/*
OLD SERVICE
export default function authorService(connection: pg.Pool) {
  dbConnection = connection;
  const service = {
    create: createAuthor,
    delete: deleteAuthor,
    get: getAuthor,
    update: updateAuthor,
    getAll: getAllAuthors,
  };
  return service;
}
*/

export type ModelConstructor<T> = new (payload: any) => T;

// NEW GENERIC SERVICE
export function genericService<T>(
  connection: pg.Pool,
  tableName: string,
  ModelClass: ModelConstructor<T>
) {
  const create = async (payload: any): Promise<T> => {
    /* 
            The line:
            const payloadValues = Object.values(payload); 

            Converts this:
            const payload = {
                title: 'Name of the Wind',
                summary: 'Very good book',
                authorid: '4',
                publisheddate: '2024-08-12'
            }

            Into this:
            ['Name of the Wind', 'Very good book', '4','2024-08-12'] 
        */

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
      // console.log(query);
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

  const getAll = async () =>{
    try {
      let query = `SELECT * FROM ${tableName} order by id;`;
      console.log(query)
      const result = await connection.query(query);
      const entityList = [];
      for(const obj of result.rows){
        const newEntity = new ModelClass(obj) as Author | Book;
        newEntity.validate();
        entityList.push(newEntity);
      };
      return entityList;
    } 
    catch(error){
      throw(error);
    }
  };

  const service = {
    create,
    getAll,
  };
  return service;
}
