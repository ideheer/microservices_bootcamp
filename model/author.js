export default class Author{
    constructor(authorPayload) {
        // console.log(authorPayload);
        const {name, bio, id} = authorPayload;
        this.name = name;
        this.bio = bio;
        this.id = id;
    }
    validate(){
        if(this.name && this.bio){
            return true;
        }
        else{
            throw new Error("Invalid Author information");
        }
    }
}