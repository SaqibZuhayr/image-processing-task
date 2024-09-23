import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { env } from '@/common/utils/envConfig';
import { logger } from '@/server';

const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = env;

// Initialize SQS client
const sqsClient = new SQSClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Sends a message to an SQS queue
 * @param queueUrl - The URL of the SQS queue
 * @param body - The message body to be sent
 */
export const sendMessageToSQS = async (queueUrl: string, body: any) => {
  try {
    const params = {
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(body), // Ensure the body is a string
    };

    const command = new SendMessageCommand(params);
    const response = await sqsClient.send(command);

    logger.info('Message sent successfully:', response.MessageId);
    return response;
  } catch (error) {
    logger.error('Error sending message to SQS:', error);
    throw error; // Re-throw the error for further handling
  }
};
