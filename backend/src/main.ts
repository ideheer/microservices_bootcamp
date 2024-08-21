import authorControllerFactory from "./controller/author";
import bookControllerFactory from "./controller/book";
import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(morgan("combined"));
app.use(cors());
app.use(express.json()); // for parsing application/json

const authorControllerObj = authorControllerFactory();
const bookControllerObj = bookControllerFactory();

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
