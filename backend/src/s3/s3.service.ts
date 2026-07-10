import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/clients/s3';


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

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `${folder}/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const data: ManagedUpload.SendData = await this.s3.upload(params).promise();
    return data.Location; // the file URL
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3
      .deleteObject({ Bucket: process.env.AWS_BUCKET_NAME!, Key: key })
      .promise();
  }
}