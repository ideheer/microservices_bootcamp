import bookControllerFactory from '../src/controller/book';
import { Request, Response } from 'express';
import { Pool } from 'pg';

jest.mock('pg', () => {
  return {
    Pool: jest.fn().mockImplementation(() => ({
      query: jest.fn(),
    })),
  };
});

describe('Book Controller', () => {
  let mockDb: jest.Mocked<Pool>;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let bookControllerObj: ReturnType<typeof bookControllerFactory>;

  beforeEach(() => {
    mockDb = new Pool() as jest.Mocked<Pool>;
    mockReq = {
      body: {
        title: 'anyTitle',
        publishedDate: 'dateBeHere',
        authorId: 'someId',
        summary: 'Something happens... or does it!?',
      },
    };
    mockRes = {
      send: jest.fn(),
    };
    bookControllerObj = bookControllerFactory(mockDb);
  });

  it('should create a book successfully', async () => {
    const resultingBook = {
      title: 'anyTitle',
      publishedDate: 'dateBeHere',
      authorId: 'someId',
      summary: 'Something happens... or does it!?',
      id: 66,
    };

    mockDb.query.mockResolvedValueOnce({ rows: [resultingBook] } as never);
    await bookControllerObj.create(mockReq as Request, mockRes as Response);

    expect(mockDb.query).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining([
        mockReq.body.title,
        mockReq.body.publishedDate,
        mockReq.body.authorId,
        mockReq.body.summary,
      ])
    );
    expect(mockRes.send).toHaveBeenCalledWith(resultingBook);
  });
});
