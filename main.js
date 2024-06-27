const express = require('express');
const app = express();
const { Pool } = require('pg');
const path = require('path'); // Importe o módulo 'path'

app.use(express.json()); // for parsing application/json

const authors = [];
let authorCounter = 0;

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

app.get('/authors', (req, res) => {
  res.json(authors);
});

app.get('/authors/:id', (req, res) => {
  let authorId = req.params.id;
  console.log('get /authors/:id', authors[authorId]);
  if(authors[authorId]){
    res.json(authors[authorId]);
  }
  else(res.status(404).send('Not found'));
});

app.put('/authors/:id', (req, res) => {
  let authorId = req.params.id;
  if(authors[authorId]){
    authIndex = authors.findIndex(obj => obj.id == authorId);
    console.log("Author updated from: ", authors[authIndex]);
    authors[authIndex].name = req.body.name;
    authors[authIndex].bio = req.body.bio;
    console.log("to: ", authors[authIndex])
  }
  else(res.status(404).send('Not found'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});