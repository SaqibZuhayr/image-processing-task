import { AppDataSource } from '../../database/dataSource';
import { Images } from '../../database/entities/images';
import { logger } from '@/server';
import { env } from '@/common/utils/envConfig';
import { sendMessageToSQS } from '@/utils/sqs';

const {
  S3_IMAGE_BUCKET_NAME,
  IMAGE_PROCESSING_QUEUE,
  AWS_SQS_HOST,
  AWS_ACCOUNT_ID,
} = env;

class ImagesService {
  async addImage(imageKey: string, url: string, description: string) {
    const logContext = 'addImage';
    const image = new Images();
    image.url = url;
    image.description = description;
    logger.info(`${logContext} Saving Image metadata in database`);
    const imageResponse = await AppDataSource.getRepository(Images).save(image);
    logger.info(`${logContext} Image metadata saved in database`);

    logger.info(`${logContext} Sending imageMetaData to sqs`);
    // Send a message to SQS to notify another service
    const messageParams = {
      fileUrl: url,
      imageKey: imageKey,
      bucket: S3_IMAGE_BUCKET_NAME,
    };

    const queueUrl = `${AWS_SQS_HOST}${AWS_ACCOUNT_ID}/${IMAGE_PROCESSING_QUEUE}`;

    sendMessageToSQS(queueUrl, messageParams);
    return imageResponse;
  }

  async fetchImageById(id: number) {
    const logContext = 'fetchImageById';
    logger.info(`${logContext} id: ${id} metadata in database`);
    const imageResponse = await AppDataSource.getRepository(Images).findOne({
      where: { id },
    });
    logger.info(`${logContext} image fetched from database for ${id}`);
    return imageResponse;
  }
}

export const imagesService = new ImagesService();
