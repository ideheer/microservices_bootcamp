import Book from "../model/book"
import pg from "pg";
import { BookPayload } from "../types/payloads";

let dbConnection:pg.Pool;

const getBookByAuthor = async (authorid:string) => {
    try{
        const result = await dbConnection.query('SELECT * FROM public.books WHERE authorid = $1', [authorid]);
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
        getByAuthor: getBookByAuthor,
    };
    return service;
};