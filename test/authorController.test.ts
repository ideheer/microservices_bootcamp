import { Pool } from 'pg';
import authorControllerFactory from '../src/controller/author';

const mockRes = {
    statusData: -1,
    responseData: null,

    status: (statusCode: number) => {
        console.log('Response status:', statusCode);
        mockRes.statusData = statusCode
        return mockRes;
    },
    send: (data: any) => {
        console.log('Response data:', data);
        mockRes.responseData = data;
        return mockRes;
    },
};

describe('Author Controller', () => {
    it('should create an author successfully', async () => {
        const mockReq = {
            body: { name: 'John Doe', bio: 'Author bio' }
        }; 

        const mockConnection = {
            query: (query: string) => {
                console.log('DB query executed:', query);
                return { 
                    rows: [
                        { id: 1, name: 'John Doe', bio: 'Author bio' }
                    ] 
                };
            },
        };

        const authorController = authorControllerFactory(mockConnection as Pool);
        await authorController.create(mockReq as any, mockRes as any);
        console.log("response", mockRes);

        expect(mockRes.responseData).toEqual({ id: 1, name: 'John Doe', bio: 'Author bio' });
    });

    it('should return 400 if required fields are missing', async () => {
        const mockReq = {
            body: { bio: 'Author bio' }
        }; 

        const mockConnection = {
            query: (query: string) => {
                console.log('DB query executed:', query);
                return { 
                    rows: [
                        { id: 1, name: 'John Doe', bio: 'Author bio' }
                    ] 
                };
            },
        };

        const authorController = authorControllerFactory(mockConnection as Pool);
        await authorController.create(mockReq as any, mockRes as any);

        expect(mockRes.statusData).toEqual(400);
        expect(mockRes.responseData).toBe("Bad request. Missing required field(s).");
    });


});
