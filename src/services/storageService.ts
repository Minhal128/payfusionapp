import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const s3 = new S3();

const uploadFile = async (filePath: string, bucketName: string) => {
    const fileContent = await promisify(fs.readFile)(filePath);
    const fileName = uuidv4() + path.extname(filePath);

    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: fileContent,
        ContentType: 'application/octet-stream',
    };

    return s3.upload(params).promise();
};

const deleteFile = async (fileName: string, bucketName: string) => {
    const params = {
        Bucket: bucketName,
        Key: fileName,
    };

    return s3.deleteObject(params).promise();
};

export { uploadFile, deleteFile };