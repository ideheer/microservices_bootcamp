import bookService from "../service/book";
import pg from "pg";
import { BookPayload } from "../types/payloads";
import { Request, Response } from "express";

let dbConnection: pg.Pool;

const createBook = async (req: Request, res: Response) => {
  const bookPayload: BookPayload = {
    title: req.body.title,
    publisheddate: req.body.publisheddate,
    authorid: req.body.authorid,
    summary: req.body.summary,
  };
  if (
    !bookPayload.title ||
    !bookPayload.publisheddate ||
    !bookPayload.authorid ||
    !bookPayload.summary
  ) {
    res.status(400).send("Bad request. Missing required field(s).");
  }
  try {
    const createdBook = await bookService(dbConnection).create(bookPayload);
    res.send(createdBook);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

//Get all books
const getAllBooks = async (req: Request, res: Response) => {
  try {
    const result = await bookService(dbConnection).getAll();
    res.json(result);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

//Get book by id
const getBook = async (req: Request, res: Response) => {
  let bookId = req.params.id;
  try {
    const result = await bookService(dbConnection).get(bookId);
    if (result == null) {
      res.status(404).send("Not found");
    } else {
      res.json(result);
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

//Update book by id
const updateBook = async (req: Request, res: Response) => {
  const bookPayload: BookPayload = {
    title: req.body.title,
    publisheddate: req.body.publisheddate,
    authorid: req.body.authorid,
    summary: req.body.summary,
    id: req.params.id,
  };
  //console.log(bookPayload);
  if (
    !bookPayload.title ||
    !bookPayload.publisheddate ||
    !bookPayload.authorid ||
    !bookPayload.summary
  ) {
    res.status(400).send("Bad request. Missing required field(s).");
  }
  try {
    const result = await bookService(dbConnection).update(bookPayload);
    res.status(404).send("Not found");
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

//Delete book by id
const deleteBook = async (req: Request, res: Response) => {
  let bookId = req.params.id;
  try {
    const result = await bookService(dbConnection).delete(bookId);
    res.json({ Success: result });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

//Get books by Author
const getBookByAuthor = async (req: Request, res: Response) => {
  let authorId = req.params.authorid;
  try {
    const result = await bookService(dbConnection).getByAuthor(authorId);
    res.json(result);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export default function bookControllerFactory(connection: pg.Pool) {
  dbConnection = connection;
  const controller = {
    create: createBook,
    getAll: getAllBooks,
    get: getBook,
    update: updateBook,
    delete: deleteBook,
    getByAuthor: getBookByAuthor,
  };
  return controller;
}
