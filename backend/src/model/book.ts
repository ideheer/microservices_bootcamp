import { BookPayload, BookListingPayload } from "../types/payloads";

export default class Book{
    public title:string;
    public publisheddate:string;
    public authorid:string;
    public summary: string;
    public id: string;
    constructor(bookPayload:BookPayload) {
        // console.log(bookPayload);
        const {title, publisheddate, authorid, summary, id} = bookPayload;
        this.title = title;
        this.publisheddate = publisheddate;
        this.authorid = authorid;
        this.summary = summary;
        this.id= id || "";
    }
    validate(){
        if(this.title && this.publisheddate && this.authorid && this.summary){
            return true;
        }
        else{
            throw new Error("Invalid Book information");
        }
    }
};

export class BookListing{
    public title:string;
    public authorid:string;
    public id:string;
    constructor(bookListingPayload: BookListingPayload) {
        const {title, authorid, id} = bookListingPayload;
        this.title = title;
        this.authorid = authorid;
        this.id= id || "";
    }
};