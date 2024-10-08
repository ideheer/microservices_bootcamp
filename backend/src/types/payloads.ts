export type BookPayload = {
    title:string,
    publisheddate:string,
    authorid:string,
    summary:string,
    id?:string
};

export type BookListingPayload = {
    title:string,
    authorid:string,
    id:string
}

export type AuthorPayload = {
    name:string,
    bio:string,
    id?:string
};

export type AuthorListingPayload = {
    name:string,
    id:string
};