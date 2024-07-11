const express = require('express');
const app = express();
const { Pool } = require('pg');
const path = require('path'); // Importe o módulo 'path'

const pool = new Pool({
  user: 'admin',
  password: 'admin123',
  host: 'localhost',
  port: 5432, // default Postgres port
  database: 'bookstoreDb'
});

app.use(express.json()); // for parsing application/json

const authors = [];
const books = [];
let authorCounter = 0;
let bookCounter = 0;

//Create author
app.post('/authors', async (req, res) => {
  // below code works. just a different method of implementation
  // const result = await pool.query(`INSERT INTO public.authors(name, bio) VALUES ('${req.body.name}', '${req.body.bio}')`);
  const result = await pool.query('INSERT INTO public.authors(name, bio) VALUES ($1, $2)', [req.body.name, req.body.bio]);
  
  // if(result.rowCount){
  //   res.send('Success');
  // };
  // Same as above
  result.rowCount ? res.send('Success') : null;
  
  // const text = 'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *'
  // const values = ['brianc', 'brian.m.carlson@gmail.com']
 
  // const res = await client.query(text, values) 
  // const newAuthor = {
  //   "name": req.body.name,
  //   "bio": req.body.bio
  // };
  // authors.push(newAuthor);
  // console.log(req.body);
  // authorCounter++;
  // res.send(req.body);
});

//Get all authors
app.get('/authors', async (req, res) => {
  // res.json(authors);
  const result = await pool.query('SELECT * FROM authors order by id');
  if(result.rows.length == 0){
    res.status(404).send('Not found');
  }
  else{
    res.json(result.rows)
  }
});

//Get author by ID
app.get('/authors/:id', async (req, res) => {
  let authorId = req.params.id;
  console.log('get /authors/:id', authors[authorId]);
  const result = await pool.query('SELECT * FROM authors WHERE id = $1', [authorId]);
  // if(authors[authorId]){
  //   res.json(authors[authorId]);
  // }
  // else(res.status(404).send('Not found'));
  if(result.rows.length == 0){
    res.status(404).send('Not found');
  }
  else{
    res.json(result.rows[0])
  }
});

//Update author by ID
app.put('/authors/:id', async (req, res) => {
  let authorId = req.params.id;
  const result = await pool.query('UPDATE public.authors SET name=$1, bio=$2 WHERE id=$3;', [req.body.name, req.body.bio, authorId]);
  if(result.rowCount == 1){
    res.send('Success');
  } 
  else{
    res.status(404).send('Not found');
  }
});

//Delete author by ID
app.delete('/authors/:id', async (req, res) => {
  let authorId = req.params.id;
  const result = await pool.query('DELETE FROM public.authors WHERE id=$1;', [authorId]);
  if(result.rowCount == 1){
    res.send('Success');
  } 
  else{
    res.status(404).send('Not found');
  }
});

//Create book
app.post('/books', (req, res) => {
  const newBook = {
    "id": bookCounter,
    "title": req.body.title,
	  "authorId": req.body.authorId,
	  "publishedDate": req.body.publishedDate,
	  "summary": req.body.summary
  };
  books.push(newBook);
  console.log(req.body);
  bookCounter++;
  res.send(req.body);
});

//Get all books
app.get('/books', (req, res) => {
  res.json(books);
});

//Get book by ID
app.get('/books/:id', (req, res) => {
  let bookId = req.params.id;
  console.log('get /books/:id', books[bookId]);
  if(books[bookId]){
    res.json(books[bookId]);
  }
  else(res.status(404).send('Not found'));
});

//Update book by ID
app.put('/books/:id', (req, res) => {
  let bookId = req.params.id;
  if(books[bookId]){
    bookIndex = books.findIndex(obj => obj.id == bookId);
    console.log("Book updated from: ", books[bookIndex]);
    books[bookIndex].title = req.body.title;
    books[bookIndex].authorId = req.body.authorId;
    books[bookIndex].publishedDate = req.body.publishedDate;
    books[bookIndex].summary = req.body.summary;
    console.log("to: ", books[bookIndex])
    res.json(books[bookId])
  }
  else(res.status(404).send('Not found'));
});

//Delete book by ID
app.delete('/books/:id', (req, res) => {
  let bookId = req.params.id;
  if(books[bookId]){
    bookIndex = books.findIndex(obj => obj.id == bookId);
    console.log("Book to be deleted: ", books[bookIndex]);
    delete books[bookIndex];
    console.log("Book deleted");
    res.send("Book removed")
  }
  else(res.status(404).send('Not found'));
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});