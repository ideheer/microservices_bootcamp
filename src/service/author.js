import Author from "../model/author.js"

let dbConnection = null;

const createAuthor = async ({name, bio}) => {
    const result = await dbConnection.query('INSERT INTO public.authors(name, bio) VALUES ($1, $2)', [name, bio]);
    return result.rowCount ? true : false;
};

const getAllAuthors = async () => {
    const result = await dbConnection.query('SELECT * FROM authors order by id');
    const authors = [];
    for(const obj of result.rows){
        const newAuthor = new Author(obj);
        newAuthor.validate();
        authors.push(newAuthor);
    };
    return authors;
};

const getAuthor = async (authorId) => {
    const result = await dbConnection.query('SELECT * FROM authors WHERE id = $1', [authorId]);
    if(result.rows.length == 0){
        return null; 
    }
    else{
        const author = new Author(result.rows[0]);
        return author;
    };
};

const updateAuthor = async ({name, bio, id}) => {
    const result = await dbConnection.query('UPDATE public.authors SET name=$1, bio=$2 WHERE id=$3;', [name, bio, id]);
    return result.rowCount ? true : false;
};

const deleteAuthor = async (authorId) => {
    try{
        const result = await dbConnection.query('DELETE FROM public.authors WHERE id=$1', [authorId]);
        return result.rowCount ? true : false;
    }
    catch(error){
        return error;
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