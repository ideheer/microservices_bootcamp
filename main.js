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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});