import Author from './model/author.js';
import Book from './model/book.js';
import authorController from './controller/author.js';
//import bookController from './controller/book.js';
import express from 'express';
import * as pg from 'pg'
import path from 'path';
import bookController from './controller/book.js';

const { Pool } = pg.default;

const app = express();

const pool = new Pool({
  user: 'admin',
  password: 'admin123',
  host: 'localhost',
  port: 5432, // default Postgres port
  database: 'bookstoreDb'
});

app.use(express.json()); // for parsing application/json

//Create author
app.post('/authors', authorController(pool).create);

//Get all authors
app.get('/authors', authorController(pool).getAll);

//Get author by ID
app.get('/authors/:id', authorController(pool).get);

//Update author by ID
app.put('/authors/:id', authorController(pool).update);

//Delete author by ID
app.delete('/authors/:id', authorController(pool).delete);

//Create a book
app.post('/books', bookController(pool).create);

//Get all books
app.get('/books', bookController(pool).getAll);

//Get book by ID
app.get('/books/:id', bookController(pool).get);

//Update book by ID
app.put('/books/:id', bookController(pool).update);

//Delete book by ID
app.delete('/books/:id', bookController(pool).delete);

//Get all books by an Author
app.get('/authors/:authorid/books', bookController(pool).getByAuthor);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});