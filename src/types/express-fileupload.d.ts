declare module 'express-fileupload' {
  import { Request, Response, NextFunction } from 'express';

  interface FileuploadOptions {
    createParentPath?: boolean;
    uriDecodeFileNames?: boolean;
    safeFileNames?: boolean;
    preserveExtension?: boolean | number;
    abortOnLimit?: boolean;
    responseOnLimit?: string;
    limitHandler?: (req: Request, res: Response, next: NextFunction) => void;
    useTempFiles?: boolean;
    tempFileDir?: string;
    parseNested?: boolean;
    debug?: boolean;
    uploadTimeout?: number;
    limits?: {
      fileSize?: number;
    };
  }

  interface UploadedFile {
    name: string;
    encoding: string;
    mimetype: string;
    data: Buffer;
    size: number;
    tempFilePath: string;
    truncated: boolean;
    md5: string;
    mv(path: string, callback: (err: any) => void): void;
    mv(path: string): Promise<void>;
  }

  interface FileArray {
    [fieldname: string]: UploadedFile[];
  }

  interface Files {
    [fieldname: string]: UploadedFile | UploadedFile[];
  }

  // Extend Express Request interface
  namespace Express {
    interface Request {
      files?: Files | null;
    }
  }

  function fileUpload(options?: FileuploadOptions): (req: Request, res: Response, next: NextFunction) => void;

  export = fileUpload;
}

