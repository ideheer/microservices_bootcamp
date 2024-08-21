import { Author } from "../model/author";
import NotFoundError from "../errors/errors";
import Book from "../model/book";
import pg from "pg";

export type ModelConstructor<T> = new (payload: any) => T;

export default function genericService<T>(
  connection: pg.Pool,
  tableName: string,
  ModelClass: ModelConstructor<T>
) {
  const create = async (payload: any): Promise<T> => {

    const payloadKeys = Object.keys(payload);
    const payloadValues = Object.values(payload);

    const payloadValuesArray = payloadValues.map((value) => {
      return "'" + value + "'";
    });

    const commaSeparatedFieldNames = payloadKeys.join(", ");
    const commaSeparatedFieldValues = payloadValuesArray.join(", ");

    try {
      let query = `INSERT INTO public.${tableName}(${commaSeparatedFieldNames}) VALUES (${commaSeparatedFieldValues}) RETURNING *;`;

      const result = await connection.query(query);
      const created = new ModelClass(result.rows[0]) as Author | Book;
      created.validate();

      return created as T;
    } catch (error) {
      throw error;
    }
  };

  const get = async (id: string) => {
    let query = `SELECT * from ${tableName} WHERE id=${id} `;
    const result = await connection.query(query);

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
      const result = await connection.query(query);
      const updated = new ModelClass(result.rows[0]) as Author | Book;
      updated.validate();
      return updated;
    } catch (error) {
      throw error;
    }
  };

  const getAll = async (): Promise<T> => {
    try {
      let query = `SELECT * FROM ${tableName} order by id;`;

      const result = await connection.query(query);
      const entityList = [];
      for (const obj of result.rows) {
        const newEntity = new ModelClass(obj) as Author | Book;
        newEntity.validate();
        entityList.push(newEntity);
      };
      return entityList as T;
    }
    catch (error) {
      throw (error);
    }
  };

  const deleteEntity = async (id: string): Promise<void> => {
    try {
      const queryCheck = `SELECT 1 FROM ${tableName} WHERE id=$1;`;
      const resultCheck = await connection.query(queryCheck, [id]);
  
      if (resultCheck.rows.length === 0) {
        throw new NotFoundError(`${ModelClass.name} with id ${id} not found.`);
      }
  
      const queryDelete = `DELETE FROM ${tableName} WHERE id=$1;`;
      await connection.query(queryDelete, [id]);
    } catch (error) {
      throw error;
    }
  };

  const service = {
    create,
    get,
    getAll,
    update,
    delete: deleteEntity,
  };

  return service;
}
