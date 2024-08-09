import authorControllerFactory from "./controller/author";
import bookControllerFactory from "./controller/book";
import express from "express";
import pg from "pg";
import cors from "cors";

const { Pool } = pg;

const app = express();

const pool = new Pool({
  user: "admin",
  password: "admin123",
  host: "localhost",
  port: 5432, // default Postgres port
  database: "bookstoreDb",
});

app.use(cors());
app.use(express.json()); // for parsing application/json

const authorControllerObj = authorControllerFactory(pool);
const bookControllerObj = bookControllerFactory(pool);

//Create author
app.post("/authors", authorControllerObj.create);

//Get all authors
app.get("/authors", authorControllerObj.getAll);

//Get author by ID
app.get("/authors/:id", authorControllerObj.get);

//Update author by ID
app.put("/authors/:id", authorControllerObj.update);

//Delete author by ID
app.delete("/authors/:id", authorControllerObj.delete);

//Create a book
app.post("/books", bookControllerObj.create);

//Get all books
app.get("/books", bookControllerObj.getAll);

//Get book by ID
app.get("/books/:id", bookControllerObj.get);

//Update book by ID
app.put("/books/:id", bookControllerObj.update);

//Delete book by ID
app.delete("/books/:id", bookControllerObj.delete);

//Get all books by an Author
app.get("/authors/:authorid/books", bookControllerObj.getByAuthor);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
