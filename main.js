const express = require('express');
const app = express();
const { Pool } = require('pg');
const path = require('path'); // Importe o módulo 'path'

app.use(express.json()); // for parsing application/json

const authors = [];
const books = [];
let authorCounter = 0;
let bookCounter = 0;

//Create author
app.post('/authors', (req, res) => {
  const newAuthor = {
    "id": authorCounter,
    "name": req.body.name,
    "bio": req.body.bio
  };
  authors.push(newAuthor);
  console.log(req.body);
  authorCounter++;
  res.send(req.body);
});

//Get all authors
app.get('/authors', (req, res) => {
  res.json(authors);
});

//Get author by ID
app.get('/authors/:id', (req, res) => {
  let authorId = req.params.id;
  console.log('get /authors/:id', authors[authorId]);
  if(authors[authorId]){
    res.json(authors[authorId]);
  }
  else(res.status(404).send('Not found'));
});

//Update author by ID
app.put('/authors/:id', (req, res) => {
  let authorId = req.params.id;
  if(authors[authorId]){
    authIndex = authors.findIndex(obj => obj.id == authorId);
    console.log("Author updated from: ", authors[authIndex]);
    authors[authIndex].name = req.body.name;
    authors[authIndex].bio = req.body.bio;
    console.log("to: ", authors[authIndex])
    res.json(authors[authorId])
  }
  else(res.status(404).send('Not found'));
});

//Delete author by ID
app.delete('/authors/:id', (req, res) => {
  let authorId = req.params.id;
  if(authors[authorId]){
    authIndex = authors.findIndex(obj => obj.id == authorId);
    console.log("Author to be deleted: ", authors[authIndex]);
    delete authors[authIndex];
    console.log("Author deleted");
    res.send("Author removed")
  }
  else(res.status(404).send('Not found'));
})

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