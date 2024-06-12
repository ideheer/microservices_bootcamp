const express = require('express');
const app = express();
const { Pool } = require('pg');

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




const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});