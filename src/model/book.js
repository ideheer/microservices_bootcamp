export default class Book{
    constructor(bookPayload) {
        // console.log(bookPayload);
        const {title, publishedDate, authorId, summary, id} = bookPayload;
        this.title = title;
        this.publishedDate = publishedDate;
        this.authorId = authorId;
        this.summary = summary;
        this.id = id;
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