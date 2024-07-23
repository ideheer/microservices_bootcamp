import bookService from "../service/book.js";

let dbConnection = null;

const createBook = async (req, res) => {
    const bookPayload = {title:req.body.title, 
      publishedDate:req.body.publishedDate, 
      authorId:req.body.authorId,
      summary: req.body.summary,
      id: -1
    };
    if (!bookPayload.title || !bookPayload.publishedDate || !bookPayload.authorId || !bookPayload.summary){
        res.status(400).send("Bad request. Missing required field(s).");
    };
    try{
        const createdBook = await bookService(dbConnection).create(bookPayload);
        res.send(createdBook);
    }
    catch(error){
        res.status(500).send(error.message);
    }
};

//Get all books
const getAllBooks = async (req, res) => {
    try{
        const result = await bookService(dbConnection).getAll();
        res.json(result);
    }
    catch(error){
        res.status(500).send(error.message);
    }
};                 

//Get book by id
const getBook = async (req, res) => {
    let bookId = req.params.id;
    try{
        const result = await bookService(dbConnection).get(bookId);
        if(result == null){
            res.status(404).send('Not found');
        }
        else{
        res.json(result);
        }
    }
    catch(error){
        res.status(500).send(error.message);
    }
};

//Update book by id
const updateBook = async (req, res) => {
    const bookPayload = {
        title:req.body.title, 
        publishedDate:req.body.publishedDate, 
        authorId:req.body.authorId,
        summary:req.body.summary,
        id:req.params.id
      };
    //console.log(bookPayload);
    if (!bookPayload.title || !bookPayload.publishedDate || !bookPayload.authorId || !bookPayload.summary){
        res.status(400).send("Bad request. Missing required field(s).");
    };
    try{
        const result = await bookService(dbConnection).update(bookPayload);
        res.status(404).send('Not found');
    }
    catch(error){
        res.status(500).send(error.message);
    }
};

//Delete book by id
const deleteBook = async (req, res) => {
    let bookId = req.params.id;
    try{
        const result = await bookService(dbConnection).delete(bookId);
        res.json({"Success":result});
    }
    catch(error){
        res.status(500).send(error.message);
    }
};

//Get books by Author
const getBookByAuthor = async (req, res) => {
    let authorId = req.params.authorid;
    try{
        const result = await bookService(dbConnection).getByAuthor(authorId);
        res.json(result);
    }
    catch(error){
        res.status(500).send(error.message);
    }
};

export default function bookController(connection){
    dbConnection = connection;
    const controller = {
        create: createBook,
        getAll: getAllBooks,
        get: getBook,
        update: updateBook,
        delete: deleteBook,
        getByAuthor: getBookByAuthor,
    }
    return controller;
};