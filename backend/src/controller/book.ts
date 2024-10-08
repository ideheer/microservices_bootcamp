import { Request, Response } from "express";
import { BookPayload } from "../types/payloads";
import bookService from "../service/book";
import genericService from "../service/generic";

import { PrismaClient, Book } from "@prisma/client";
const prisma = new PrismaClient();

// Create book
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
    return;
  }

  try {
    const service = genericService<Book>(prisma.book);
    const createdBook = await service.create(bookPayload);
    res.send(createdBook);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

// Get all books
const getAllBooks = async (req: Request, res: Response) => {
  try {
    const service = genericService<Book>(prisma.book);
    const result = await service.getAll();
    res.json(result);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

// Get book by id
const getBook = async (req: Request, res: Response) => {
  let bookId = req.params.id;
  try {
    const service = genericService<Book>(prisma.book);
    const result = await service.get(bookId);
    res.json(result);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

// Update book by id
const updateBook = async (req: Request, res: Response) => {
  const bookPayload: BookPayload = {
    title: req.body.title,
    publisheddate: req.body.publisheddate,
    authorid: req.body.authorid,
    summary: req.body.summary,
    id: req.params.id,
  };

  if (
    !bookPayload.title ||
    !bookPayload.publisheddate ||
    !bookPayload.authorid ||
    !bookPayload.summary
  ) {
    res.status(400).send("Bad request. Missing required field(s).");
    return;
  }

  try {
    const service = genericService<Book>(prisma.book);
    const result = await service.update(bookPayload);
    res.send(result);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

// Delete book by id
const deleteBook = async (req: Request, res: Response) => {
  let bookId = req.params.id;
  try {
    const service = genericService<Book>(prisma.book);
    await service.delete(bookId);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

// Get books by Author
const getBookByAuthor = async (req: Request, res: Response) => {
  let authorId = req.params.authorid;
  try {
    const result = await bookService().getByAuthor(authorId);
    res.json(result);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export default function bookControllerFactory() {
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
