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

// const createAuthor = async (req, res) => {
//     try{
//       const authorPayload = {name:req.body.name, bio:req.body.bio, id:-1};
//       const author = new Author(authorPayload);
//       author.validate();
//       const result = await pool.query('INSERT INTO public.authors(name, bio) VALUES ($1, $2)', [author.name, author.bio]);
//       result.rowCount ? res.send('Success') : null;
//     }
//     catch(error){
//       res.status(400).send(error.message);
//     }
// };

//Get all authors
app.get('/authors', authorController(pool).getAll);

// app.get('/authors', async (req, res) => {
//     const result = await pool.query('SELECT * FROM authors order by id');
//         if(result.rows.length == 0){
//             res.status(404).send('Not found');
//         }
//         else{
//             const authors = [];
//         try{
//         for(const obj of result.rows){
//             const newAuthor = new Author(obj);
//             newAuthor.validate();
//             authors.push(newAuthor);
//         }
//         res.json(authors);
//         }
//         catch(error){
//         res.status(500).send(error.message);
//         }
//     } 
// })

//Get author by ID
app.get('/authors/:id', authorController(pool).get);

// app.get('/authors/:id', async (req, res) => {
//   let authorId = req.params.id;
//   console.log('get /authors/:id', authors[authorId]);
//   const result = await pool.query('SELECT * FROM authors WHERE id = $1', [authorId]);

//   if(result.rows.length == 0){
//     res.status(404).send('Not found');
//   }
//   else{
//     const author = new Author(result.rows[0]);
//     const validation = author.validate();
//     if(!validation){
//       res.status(500).send('Invalid Author, validation failed');
//     }
//     res.json(author);
//   }
// });

//Update author by ID
app.put('/authors/:id', authorController(pool).update);

// app.put('/authors/:id', async (req, res) => {
//   let authorId = req.params.id;
//   const result = await pool.query('UPDATE public.authors SET name=$1, bio=$2 WHERE id=$3;', [req.body.name, req.body.bio, authorId]);
//   if(result.rowCount == 1){
//     res.send('Success');
//   } 
//   else{
//     res.status(404).send('Not found');
//   }
// });

//Delete author by ID
app.delete('/authors/:id', authorController(pool).delete);

// app.delete('/authors/:id', async (req, res) => {
//   let authorId = req.params.id;
//   const result = await pool.query('DELETE FROM public.authors WHERE id=$1', [authorId]);
//   if(result.rowCount == 1){
//     res.send('Success');
//   } 
//   else{
//     res.status(404).send('Not found');
//   }
// });

//Create a book
app.post('/books', bookController(pool).create);

// app.post('/books', async (req, res) => {
//   try{
//     const bookPayload = {
//       title:req.body.title, 
//       publishedDate:req.body.publishedDate, 
//       authorId:req.body.authorId,
//       summary: req.body.summary,
//       id:-1
//     };
//     const book = new Book(bookPayload);
//     book.validate();
//     const result = await pool.query('INSERT INTO public.books(title, "publishedDate", "authorId", summary) VALUES ($1, $2, $3, $4)', [book.title, book.publishedDate, book.authorId, book.summary]);
//     result.rowCount ? res.send('Success') : null;
//   }
//   catch(error){
//     res.status(400).send(error.message);
//   }
// });


//Get all books
app.get('/books', bookController(pool).getAll);

// app.get('/books', async (req, res) => {
//   // res.json(authors);
//   const result = await pool.query('SELECT * FROM books order by id');
//   if(result.rows.length == 0){
//     res.status(404).send('Not found');
//   }
//   else{
//     const books = [];
//     try{
//       for(const obj of result.rows){
//         const newBook = new Book(obj);
//         newBook.validate();
//         books.push(newBook);
//       }
//       res.json(books);
//     }
//     catch(error){
//       res.status(500).send(error.message);
//     }
//   }
// });

//Get book by ID
app.get('/books/:id', bookController(pool).get);

// app.get('/books/:id', async (req, res) => {
//   let bookId = req.params.id;
//   const result = await pool.query('SELECT * FROM books WHERE id = $1', [bookId]);

//   if(result.rows.length == 0){
//     res.status(404).send('Not found');
//   }
//   else{
//     const book = new Book(result.rows[0]);
//     const validation = book.validate();
//     if(!validation){
//       res.status(500).send('Invalid Book, validation failed');
//     }
//     res.json(book);
//   }
// });

//Update book by ID
app.put('/books/:id', bookController(pool).update);

// app.put('/books/:id', async (req, res) => {
//   let bookId = req.params.id;
//   const result = await pool.query('UPDATE public.books SET title=$1, "authorId"=$2, "publishedDate"=$3, summary=$4 WHERE id=$5;', [req.body.title, req.body.authorId, req.body.publishedDate, req.body.summary, bookId]);
//   if(result.rowCount == 1){
//     res.send('Success');
//   } 
//   else{
//     res.status(404).send('Not found');
//   }
// });

//Delete book by ID
app.delete('/books/:id', bookController(pool).delete);

// app.delete('/books/:id', async (req, res) => {
//   let bookId = req.params.id;
//   const result = await pool.query('DELETE FROM public.books WHERE id=$1', [bookId]);
//   if(result.rowCount == 1){
//     res.send('Success');
//   } 
//   else{
//     res.status(404).send('Not found');
//   }
// });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});