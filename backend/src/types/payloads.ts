export type BookPayload = {
    title:string,
    publishedDate:string,
    authorId:string,
    summary:string,
    id?:string
};

export type AuthorPayload = {
    name:string,
    bio:string,
    id?:string
};

export type AuthorListingPayload = {
    name:string,
    id:string
};