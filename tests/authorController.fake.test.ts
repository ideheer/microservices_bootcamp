import authorControllerFactory from '../src/controller/author';
import pg from "pg";
import { Author } from '../src/model/author';


describe('Author Controller', () => {
    it('should create an author successfully', async () => {
        const resultingAuthor = {
            name:'anyNameILike',
            bio:'anyBioILike',
            id:1898
        };

        const mockDb = {
            query:function(queryCommand:String, values:Array<string>){
                console.log(queryCommand, values)
                return{
                    rows:[resultingAuthor]
                }
            }
        }

        const mockReq = {
            body: {
                name:'anyNameILike',
                bio:'anyBioILike'
            }
        }

        let receivedData;
        const mockRes = {
            send:function(receivedAuthor:any){
                console.log('Send function called', receivedAuthor);
                receivedData = receivedAuthor;
            }
        }
        
        const authorControllerObj = authorControllerFactory(mockDb as any);
        await authorControllerObj.create(mockReq as any, mockRes as any)
        expect(receivedData).toEqual(resultingAuthor)
    });

});