import Author from "../model/author.js"
import NotFoundError from "../errors/errors.js";

let dbConnection = null;

const createAuthor = async ({name, bio}) => {
    try{
        const result = await dbConnection.query('INSERT INTO public.authors(name, bio) VALUES ($1, $2) RETURNING *;', [name, bio]);
        const createdAuthor = new Author(result.rows[0]);
        createdAuthor.validate();
        return createdAuthor;
    }
    catch(error){
        throw(error);
    }
};

const getAllAuthors = async () => {
    try{
        const result = await dbConnection.query('SELECT * FROM authors order by id;');
        const authors = [];
        for(const obj of result.rows){
            const newAuthor = new Author(obj);
            newAuthor.validate();
            authors.push(newAuthor);
        }
        return authors;
    }
    catch(error){
        throw(error);
    }
};

const getAuthor = async (authorId) => {
    const result = await dbConnection.query('SELECT * FROM authors WHERE id = $1;', [authorId]);
    if(result.rows.length == 0){
        throw new NotFoundError("Not found."); 
    }
    else{
        const author = new Author(result.rows[0]);
        return author;
    };
};

const updateAuthor = async ({name, bio, id}) => {
    try{
        const result = await dbConnection.query('UPDATE public.authors SET name=$1, bio=$2 WHERE id=$3 RETURNING *;', [name, bio, id]);
        const updatedAuthor = new Author(result.rows[0]);
        updatedAuthor.validate();
        return updatedAuthor;
    }
    catch(error){
        throw(error);
    }
};

const deleteAuthor = async (authorId) => {
    try{
        const result = await dbConnection.query('DELETE FROM public.authors WHERE id=$1;', [authorId]);
        if(result.rowCount == 0){
            throw(new NotFoundError("Not Found"));
        }
        return result.rowCount == 1 ? true : false;
    }
    catch(error){
        throw(error);
    }
};

export default function authorService(connection){
    dbConnection = connection;
    const service = {
        create: createAuthor,
        delete: deleteAuthor,
        get: getAuthor,
        update: updateAuthor,
        getAll: getAllAuthors,
    };
    return service;
};