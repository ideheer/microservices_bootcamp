import Book from "../model/book"
import pg from "pg";
import { BookPayload } from "../types/payloads";

let dbConnection:pg.Pool;

const createBook = async ({title, publishedDate, authorId, summary}:BookPayload) => {
    try{
      const result = await dbConnection.query('INSERT INTO public.books(title, "publishedDate", "authorId", summary) VALUES ($1, $2, $3, $4) RETURNING *', [title, publishedDate, authorId, summary]);
      const createdBook = new Book(result.rows[0]);
      createdBook.validate();
      return createdBook;
    }
    catch(error){
        throw(error);
    }
};

const getAllBooks = async () => {
   try{
        const result = await dbConnection.query('SELECT * FROM books order by id');
        const books = [];
        for(const obj of result.rows){
            const newBook = new Book(obj);
            newBook.validate();
            books.push(newBook);
        };
        return books;
    }
    catch(error){
        throw(error);
    }
};

const getBook = async (bookId:string) => {
    const result = await dbConnection.query('SELECT * FROM books WHERE id = $1', [bookId]);
    if(result.rows.length == 0){
        return null; 
    }
    else{
        const book = new Book(result.rows[0]);
        return book;
    };
};

const updateBook = async ({title, publishedDate, authorId, summary, id}:BookPayload) => {
    const result = await dbConnection.query('UPDATE public.books SET title=$1, "publishedDate"=$2, "authorId"=$3, summary=$4 WHERE id=$5;', [title, publishedDate, authorId, summary, id]);
    return result.rowCount ? true : false;
};

const deleteBook = async (bookId:string) => {
    try{
        const result = await dbConnection.query('DELETE FROM public.books WHERE id=$1', [bookId]);
        return result.rowCount ? true : false;
    }
    catch(error){
        return error;
    }
};

const getBookByAuthor = async (authorId:string) => {
    try{
        const result = await dbConnection.query('SELECT * FROM public.books WHERE "authorId" = $1', [authorId]);
        const books = [];
        for(const obj of result.rows){
            const newBook = new Book(obj);
            newBook.validate();
            books.push(newBook);
        };
        return books;
    }
    catch(error){
        throw(error);
    }
}

export default function bookService(connection:pg.Pool){
    dbConnection = connection;
    const service = {
        create: createBook,
        delete: deleteBook,
        get: getBook,
        update: updateBook,
        getAll: getAllBooks,
        getByAuthor: getBookByAuthor,
    };
    return service;
};