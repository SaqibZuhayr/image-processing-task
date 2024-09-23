import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Request } from 'express';
import { env } from '@/common/utils/envConfig';
import { logger } from '@/server';

const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = env;

// Configure the S3 client
const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID!,
    secretAccessKey: AWS_SECRET_ACCESS_KEY!,
  },
});

const uploadToS3 = (bucket: string) => {
  return async (req: Request, res: any, next: any) => {
    const logContext = 'uploadToS3';
    logger.info(`${logContext} uploading image to s3`);
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, buffer } = req.file;

    const params = {
      Bucket: bucket,
      Key: Date.now().toString() + '-' + originalname,
      Body: buffer,
    };

    try {
      await s3Client.send(new PutObjectCommand(params));
      req.file.s3Url = `https://${bucket}.s3.amazonaws.com/${params.Key}`;
      req.file.key = params.Key;
      logger.info(`${logContext} file successfully uploaded to s3`);
      next();
    } catch (s3Error) {
      return res
        .status(500)
        .json({ message: 'Error uploading to S3', error: s3Error });
    }
  };
};

export { uploadToS3 };
