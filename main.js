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
  const result = await pool.query('DELETE FROM public.authors WHERE id=$1', [authorId]);
  if(result.rowCount == 1){
    res.send('Success');
  } 
  else{
    res.status(404).send('Not found');
  }
});

//Create book
app.post('/books', async (req, res) => {
  const result = await pool.query('INSERT INTO public.books(title, "publishedDate", "authorId", summary) VALUES ($1, $2, $3, $4)', [req.body.title, req.body.publishedDate, req.body.authorId, req.body.summary]);
  result.rowCount ? res.send('Success') : null;
});

//Get all books
app.get('/books', async (req, res) => {
  const result = await pool.query('SELECT * FROM books order by id');
  if(result.rows.length == 0){
    res.status(404).send('Not Found');
  }
  else{
    res.json(result.rows)
  }
});

//Get book by ID
app.get('/books/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM books WHERE id = $1', [req.params.id]);
  if(result.rows.length == 0){
    res.status(404).send('Not found');
  }
  else{
    res.json(result.rows[0])
  }
});

//Update book by ID
app.put('/books/:id', async (req, res) => {
  let bookId = req.params.id;
  const result = await pool.query('UPDATE public.books SET title=$1, "authorId"=$2, "publishedDate"=$3, summary=$4 WHERE id=$5;', [req.body.title, req.body.authorId, req.body.publishedDate, req.body.summary, bookId]);
  if(result.rowCount == 1){
    res.send('Success');
  } 
  else{
    res.status(404).send('Not found');
  }
});

//Delete book by ID
app.delete('/books/:id', async (req, res) => {
  let bookId = req.params.id;
  const result = await pool.query('DELETE FROM public.books WHERE id=$1', [bookId]);
  if(result.rowCount == 1){
    res.send('Success');
  }
  else{
    res.status(404).send('Not found');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});