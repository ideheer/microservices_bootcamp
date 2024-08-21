import { PrismaClient, Author, Book } from "@prisma/client";
import NotFoundError from "../errors/errors";

const prisma = new PrismaClient();

type ModelType = Author | Book;

export default function genericService<T extends ModelType>(model: any) {
  const create = async (payload: any): Promise<T> => {
    try {
      const created = (await model.create({ data: payload })) as T;
      return created as T;
    } catch (error) {
      throw error;
    }
  };

  const get = async (id: string): Promise<T> => {
    try {
      const result = (await model.findUnique({
        where: {
          id: parseInt(id),
        },
      })) as T;

      if (!result) {
        throw new NotFoundError("Not found.");
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  const update = async (payload: any): Promise<T> => {
    try {
      const updated = (await model.update({
        where: { id: parseInt(payload.id) },
        data: payload,
      })) as T;

      return updated;
    } catch (error) {
      throw error;
    }
  };

  const getAll = async (): Promise<T[]> => {
    try {
      let results = (await model.findMany({ orderBy: { id: "asc" } })) as T[];

      return results;
    } catch (error) {
      throw error;
    }
  };

  const deleteEntity = async (id: string): Promise<void> => {
    try {
      await model.delete({ where: { id: parseInt(id) } });
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
