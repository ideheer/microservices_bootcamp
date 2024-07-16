import authorService from "../service/author.js";

let dbConnection = null;

const createAuthor = async (req, res) => {
    const authorPayload = {name:req.body.name, bio:req.body.bio};
    if (!authorPayload.name || !authorPayload.bio){
        res.status(400).send("Bad request. Missing required field(s).");
    }
    try{
        const result = await authorService(dbConnection).create(authorPayload);
        res.json({"Success":result});
    }
    catch(error){
        res.status(500).send(error.message);
    }
};

// const createAuthor = async (req, res) => {
//     try{
//       const authorPayload = {name:req.body.name, bio:req.body.bio, id:-1};
//       const author = new Author(authorPayload);
//       author.validate();
//       const result = await pool.query('INSERT INTO public.authors(name, bio) VALUES ($1, $2)', [author.name, author.bio]);
//       result.rowCount ? res.send('Success') : null;
//     }
//     catch(error){
//       res.status(400).send(error.message);
//     }
// };

const getAuthor = (req, res) => {

};

const getAllAuthors = (req, res) => {

};

const deleteAuthor = (req, res) => {

};

export default function authorController(connection){
    dbConnection = connection;
    const controller = {
        create: createAuthor,
        delete: deleteAuthor,
        get: getAuthor,
        getAll: getAllAuthors,
    }
    return controller;
};