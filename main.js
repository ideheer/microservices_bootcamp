const express = require('express');
const app = express();
const { Pool } = require('pg');
const path = require('path'); // Importe o módulo 'path'

app.use(express.json()); // for parsing application/json

// Create a new pool of connections for the database
const pool = new Pool({
  user: 'dbuser',
  host: 'database.server.com',
  database: 'mydb',
  password: 'secretpassword',
  port: 5432,
});

app.post('/insert', async (req, res) => {
  const { name, email } = req.body;

  try {
    const result = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email]);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});
function my_function(req, res) {
  res.json({ message: 'This is the Select Page.' });
}
app.get('/select', my_function);


// Homepage usando Funcao sem nome
app.get('/',
  async (req, res) => {
    // res.json({ message: 'Hello world! select 2' });
    const filePath = path.join(__dirname, 'Pages', 'Homepage', 'Homepage.html');
    res.sendFile(filePath);
  });

// info page chamando funcao
function HandleFunction(req, res) {
  // res.json({ message: "Hello world! " + req.params.id })
  const filePath = path.join(__dirname, 'Pages', 'InfoPage', 'InfoPage.html');
  res.sendFile(filePath);
}

app.get('/info', HandleFunction)

// 3
const ArrowFunction = (req, res) => {
  res.json({ message: "Hello world! " })
}
app.get('/', ArrowFunction)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});