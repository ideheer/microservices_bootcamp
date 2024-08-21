import { PrismaClient, Book } from "@prisma/client";

const prisma = new PrismaClient();

const getBookByAuthor = async (authorId: string) => {
  try {
    const books = await prisma.book.findMany({
      where: {
        authorId: parseInt(authorId), // Assuming authorId is an integer
      },
    });

    return books;
  } catch (error) {
    throw error;
  }
};

export default function bookService() {
  const service = {
    getByAuthor: getBookByAuthor,
  };
  return service;
}
