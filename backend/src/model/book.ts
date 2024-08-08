import { BookPayload } from "../types/payloads";

export default class Book{
    public title:string;
    public publishedDate:string;
    public authorId:string;
    public summary: string;
    public id: string;
    constructor(bookPayload:BookPayload) {
        // console.log(bookPayload);
        const {title, publishedDate, authorId, summary, id} = bookPayload;
        this.title = title;
        this.publishedDate = publishedDate;
        this.authorId = authorId;
        this.summary = summary;
        this.id= id || "";
    }
    validate(){
        if(this.title && this.publishedDate && this.authorId && this.summary){
            return true;
        }
        else{
            throw new Error("Invalid Book information");
        }
    }
};