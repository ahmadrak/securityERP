import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

@Injectable()
export class S3Service {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
    });
  }

  getMulterS3Uploader(folder: string) {
    return multer({
      storage: multerS3({
        s3: this.s3,
        bucket: process.env.AWS_BUCKET_NAME!,
        acl: 'public-read',
        key: function (req, file, cb) {
          const filename = `${folder}/${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    });
  }
}