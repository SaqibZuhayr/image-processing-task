import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    file?: {
      s3Url?: string;
      buffer?: Buffer;
      originalname?: string;
      key?: string;
    };
  }
}
