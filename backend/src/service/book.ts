import Book from "../model/book"
import pg from "pg";
import { BookPayload } from "../types/payloads";

let dbConnection:pg.Pool;

const createBook = async ({title, publisheddate, authorid, summary}:BookPayload) => {
    try{
      const result = await dbConnection.query('INSERT INTO public.books(title, publisheddate, authorid, summary) VALUES ($1, $2, $3, $4) RETURNING *', [title, publisheddate, authorid, summary]);
      const createdBook = new Book(result.rows[0]);
      createdBook.validate();
      return createdBook;
    }
    catch(error){
        throw(error);
    }
};

//Deprecated
// const getAllBooks = async () => {
//    try{
//         console.log("This shouldn't be here")
//         const result = await dbConnection.query('SELECT * FROM books order by id');
//         const books = [];
//         for(const obj of result.rows){
//             const newBook = new Book(obj);
//             newBook.validate();
//             books.push(newBook);
//         };
//         return books;
//     }
//     catch(error){
//         throw(error);
//     }
// };

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

const updateBook = async ({title, publisheddate, authorid, summary, id}:BookPayload) => {
    const result = await dbConnection.query('UPDATE public.books SET title=$1, publisheddate=$2, authorid=$3, summary=$4 WHERE id=$5;', [title, publisheddate, authorid, summary, id]);
    return result.rowCount ? true : false;
};

const deleteBook = async (bookid:string) => {
    try{
        const result = await dbConnection.query('DELETE FROM public.books WHERE id=$1', [bookid]);
        return result.rowCount ? true : false;
    }
    catch(error){
        return error;
    }
};

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
        create: createBook,
        delete: deleteBook,
        get: getBook,
        update: updateBook,
        getByAuthor: getBookByAuthor,
    };
    return service;
};