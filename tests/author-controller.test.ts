import authorControllerFactory from '../src/controller/author';
import { Request, Response } from 'express';
import { Pool } from 'pg';

jest.mock('pg', () => {
  return {
    Pool: jest.fn().mockImplementation(() => ({
      query: jest.fn(),
    })),
  };
});

describe('Author Controller', () => {
  let mockDb: jest.Mocked<Pool>;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let authorControllerObj: ReturnType<typeof authorControllerFactory>;

  beforeEach(() => {
    mockDb = new Pool() as jest.Mocked<Pool>;
    mockReq = {
      body: {
        name: 'anyNameILike',
        bio: 'anyBioILike',
      },
    };
    mockRes = {
      send: jest.fn(),
    };
    authorControllerObj = authorControllerFactory(mockDb);
  });

  it('should create an author successfully', async () => {
    const resultingAuthor = {
      name: 'anyNameILike',
      bio: 'anyBioILike',
      id: 1898,
    };


    mockDb.query.mockResolvedValueOnce({ rows: [resultingAuthor] } as never);

    await authorControllerObj.create(mockReq as Request, mockRes as Response);

    expect(mockDb.query).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining([mockReq.body.name, mockReq.body.bio])
    );
    expect(mockRes.send).toHaveBeenCalledWith(resultingAuthor);
  });
});
