import { Request } from 'express';
import * as multer from 'multer';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    [key: string]: any;
  };
  file?: Express.Multer.File;
}