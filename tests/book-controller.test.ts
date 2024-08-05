import bookControllerFactory from '../src/controller/book';
import pg from "pg";
import Book from '../src/model/book';

// const { Pool } = pg;

// const pool = new Pool({
//   user: 'admin',
//   password: 'admin123',
//   host: 'localhost',
//   port: 5432, // default Postgres port
//   database: 'bookstoreDb'
// });

describe('Book Controller', () => {
    it('should create a book successfully', async () => {
        const resultingBook = {
            title:'anyTitle',
            publishedDate:'dateBeHere',
            authorId:'someId',
            summary:'Something happens... or does it!?',
            id: 66

        };
        const mockDb = {
            query:function(queryCommand:String, values:Array<string>){
                console.log(queryCommand, values)
                return{
                    rows:[resultingBook]
                }
            }
        }
        const mockReq = {
            body: {
                title:'anyTitle',
                publishedDate:'dateBeHere',
                authorId:'someId',
                summary:'Something happens... or does it!?',
                id: 66
            }
        }
        let receivedData;
        const mockRes = {
            send:function(receivedBook:any){
                console.log('Send function called', receivedBook);
                receivedData = receivedBook;
            }
        }
        const bookControllerObj = bookControllerFactory(mockDb as any);
        await bookControllerObj.create(mockReq as any, mockRes as any)
        expect(receivedData).toEqual(resultingBook)
    });

});