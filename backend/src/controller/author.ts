import NotFoundError from "@src/errors/errors";
import authorService from "@src/service/author";
import pg from "pg";
import { AuthorPayload } from "@src/types/payloads";
import { Request, Response } from 'express';

let dbConnection:pg.Pool;

//Create author
const createAuthor = async (req:Request, res:Response) => {
    const authorPayload:AuthorPayload = {
        name:req.body.name, 
        bio:req.body.bio
    };
    if (!authorPayload.name || !authorPayload.bio){
        res.status(400).send("Bad request. Missing required field(s).");
        return;
    }
    try{
        const createdAuthor = await authorService(dbConnection).create(authorPayload);
        res.send(createdAuthor);
    }
    catch(error:any){
        res.status(500).send(error.message);
    }
};

//Get all authors
const getAllAuthors = async (req:Request, res:Response) => {
    try{
        const result = await authorService(dbConnection).getAll();
        res.json(result);
    }
    catch(error:any){
        res.status(500).send(error.message);
    }
};                 

//Get author by id
const getAuthor = async (req:Request, res:Response) => {
    let authorId = req.params.id;
    try{
        const result = await authorService(dbConnection).get(authorId);
        res.json(result);
    }
    catch(error:any){
        if(error instanceof NotFoundError){
            res.status(404).send(error.message);
        }
        else{
            res.status(500).send(error.message);
        }
    }
};

//Update author by id
const updateAuthor = async (req:Request, res:Response) => {
    const authorPayload:AuthorPayload = {
        name:req.body.name, 
        bio:req.body.bio, 
        id:req.params.id
    };
    //console.log(authorPayload);
    if (!authorPayload.name || !authorPayload.bio){
        res.status(400).send("Bad request. Missing required field(s).");
    }
    try{
        const updatedAuthor = await authorService(dbConnection).update(authorPayload);
        res.send(updatedAuthor);
    }
    catch(error:any){
        res.status(500).send(error.message);
    }
};

//Delete author by id
const deleteAuthor = async (req:Request, res:Response) => {
    let authorId = req.params.id;
    try{
        const result = await authorService(dbConnection).delete(authorId);
        res.json({"Success":result});
    }
    catch(error:any){
        if(error instanceof NotFoundError){
            res.status(404).send(error.message);
        }
        else{
            res.status(500).send(error.message);
        }
    }
};

export default function authorControllerFactory(connection:pg.Pool){
    dbConnection = connection;
    const controller = {
        create: createAuthor,
        getAll: getAllAuthors,
        get: getAuthor,
        update: updateAuthor,
        delete: deleteAuthor,
    }
    return controller;
};