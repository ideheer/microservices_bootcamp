let dbConnection = null;

const createAuthor = async ({name, bio}) => {
    const result = await dbConnection.query('INSERT INTO public.authors(name, bio) VALUES ($1, $2)', [name, bio]);
    return result.rowCount ? true : false;
};


const getAuthor = () => {

};

const getAllAuthors = () => {

};

const deleteAuthor = (req, res) => {

};

export default function authorService(connection){
    dbConnection = connection;
    const service = {
        create: createAuthor,
        delete: deleteAuthor,
        get: getAuthor,
        getAll: getAllAuthors,
    };
    return service;
};