import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from '@aws-sdk/client-sqs';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { env } from '@/common/utils/envConfig';
import {
  draftImageProcessingEmail,
  draftImageProcessingErrorEmail,
} from '@/utils/smtp';
import { transformImage } from '@/utils/jimp';
import { Readable } from 'stream';
import { logger } from '@/server';
import { FAILURE_FREQUENCY, MAX_MESSAGES } from '@/utils/constants';

const {
  IMAGE_PROCESSING_QUEUE,
  AWS_REGION,
  S3_IMAGE_BUCKET_NAME,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_SQS_HOST,
  AWS_ACCOUNT_ID,
} = env;

let imageProcessCounter = 0;

const sqsClient = new SQSClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});
const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

const queueUrl = `${AWS_SQS_HOST}${AWS_ACCOUNT_ID}/${IMAGE_PROCESSING_QUEUE}`;

export async function processSQSMessages() {
  let imageKey = '';
  try {
    logger.info(`Listening for messages from: ${IMAGE_PROCESSING_QUEUE}`);

    // Fetch the message from SQS
    const receiveParams = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: MAX_MESSAGES, // Process one message at a time
    };

    const sqsResponse = await sqsClient.send(
      new ReceiveMessageCommand(receiveParams)
    );

    if (!sqsResponse.Messages || sqsResponse.Messages.length === 0) {
      console.log('No messages to process.');
      return;
    }

    const message = sqsResponse.Messages[0];
    const body = JSON.parse(message.Body || '{}');
    imageKey = body.imageKey;

    logger.info(`Received event for imageKey: ${imageKey}`);

    // Fetch the image from S3
    const getObjectParams = {
      Bucket: S3_IMAGE_BUCKET_NAME,
      Key: imageKey,
    };
    const s3Response = await s3Client.send(
      new GetObjectCommand(getObjectParams)
    );

    if (s3Response.Body) {
      const rotatedImageBuffer = await transformImage(
        s3Response.Body as Readable
      );

      // Simulate failure on every third image
      if (imageProcessCounter % FAILURE_FREQUENCY === 0) {
        // Delete the message after processing
        const deleteParams = {
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle,
        };
        await sqsClient.send(new DeleteMessageCommand(deleteParams));
        imageProcessCounter++;
        throw new Error('Error Processing this image');
      }

      // Email the rotated image to users
      await draftImageProcessingEmail(rotatedImageBuffer);

      // Delete the message after processing
      const deleteParams = {
        QueueUrl: queueUrl,
        ReceiptHandle: message.ReceiptHandle,
      };
      await sqsClient.send(new DeleteMessageCommand(deleteParams));
      imageProcessCounter++;
      logger.info(
        `Message processed and deleted successfully for imageKey ${imageKey}`
      );
    }
  } catch (error: any) {
    let errorMessage = error.message || JSON.stringify(error);
    logger.error(`Error processing message: ${errorMessage}`);
    draftImageProcessingErrorEmail(imageKey, errorMessage);
  }
}
