import { Request, Response } from 'express';
import { imagesService } from '@/api/images/ImagesService';
import { uploadToS3 } from '@/utils/s3';
import { logger } from '@/server';

// Add Image API using S3
export const addImage = (req: Request, res: Response) => {
  const bucketName = process.env.S3_IMAGE_BUCKET_NAME!;

  uploadToS3(bucketName)(req, res, async () => {
    try {
      const context = 'addImage';
      const imageUrl = req.file?.s3Url; // Now this should work without errors
      const imageKey = req.file?.key;
      const description = req.body.description;

      logger.info(`${context} imageKey: ${imageKey} s3ImageUrl: ${imageUrl}`);

      if (imageUrl && imageKey) {
        const image = await imagesService.addImage(
          imageKey,
          imageUrl,
          description
        );
        return res
          .status(201)
          .json({ message: 'Image added successfully', image });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Error adding image', error });
    }
  });
};
