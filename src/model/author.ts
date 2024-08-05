import { AuthorPayload } from "@src/types/payloads";

export default class Author{
    public name:string;
    public bio:string;
    public id:string;
    constructor(authorPayload:AuthorPayload) {
        // console.log(authorPayload);
        const {name, bio, id} = authorPayload;
        this.name = name;
        this.bio = bio;
        this.id= id || "";
    }
    validate(){
        if(this.name && this.bio){
            return true;
        }
        else{
            throw new Error("Invalid Author information");
        }
    }
};