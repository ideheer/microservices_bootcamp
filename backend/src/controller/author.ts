import { Request, Response } from "express";
import { AuthorPayload } from "../types/payloads";
import genericService from "../service/generic";
import NotFoundError from "../errors/errors";

import { PrismaClient, Author } from "@prisma/client";
const prisma = new PrismaClient();

// Create author
const createAuthor = async (req: Request, res: Response) => {
  const authorPayload: AuthorPayload = {
    name: req.body.name,
    bio: req.body.bio,
  };
  if (!authorPayload.name || !authorPayload.bio) {
    res.status(400).send("Bad request. Missing required field(s).");
    return;
  }
  try {
    const service = genericService<Author>(prisma.author);
    console.log("SanityCheck: createAuthor Controller hit");
    const createdAuthor = await service.create(authorPayload);

    res.send(createdAuthor);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

// Get all authors
const getAllAuthors = async (req: Request, res: Response) => {
  try {
    const authorList = await genericService<Author>(prisma.author).getAll();
    res.json(authorList);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

// Get author by id
const getAuthor = async (req: Request, res: Response) => {
  let authorId = req.params.id;
  try {
    const result = await genericService<Author>(prisma.author).get(authorId);
    res.json(result);
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      res.status(404).send(error.message);
    } else {
      res.status(500).send(error.message);
    }
  }
};

// Update author by id
const updateAuthor = async (req: Request, res: Response) => {
  const authorPayload: AuthorPayload = {
    name: req.body.name,
    bio: req.body.bio,
    id: req.params.id,
  };

  if (!authorPayload.name || !authorPayload.bio) {
    res.status(400).send("Bad request. Missing required field(s).");
  }

  try {
    const updatedAuthor = await genericService<Author>(prisma.author).update(
      authorPayload
    );
    res.send(updatedAuthor);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

// Delete author by id
const deleteAuthor = async (req: Request, res: Response) => {
  let authorId = req.params.id;
  try {
    const service = genericService<Author>(prisma.author);
    await service.delete(authorId);
    res.json({ success: true });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      res.status(404).send(error.message);
    } else {
      res.status(500).send(error.message);
    }
  }
};

export default function authorControllerFactory() {
  const controller = {
    create: createAuthor,
    getAll: getAllAuthors,
    get: getAuthor,
    update: updateAuthor,
    delete: deleteAuthor,
  };
  return controller;
}
