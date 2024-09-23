import nodemailer from 'nodemailer';
import { env } from '@/common/utils/envConfig';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { logger } from '@/server';

const {
  SMTP_HOST_NAME,
  SMTP_PASSWORD,
  SMTP_USERNAME,
  SMTP_PORT,
  SMTP_FROM,
  SMTP_TO,
  SMTP_TO_ADMIN,
} = env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST_NAME,
  port: SMTP_PORT, // Use 587 for TLS or 465 for SSL
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD,
  },
});

export const sendEmail = async (mailOptions: MailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.response}`);
  } catch (error) {
    logger.error(`Error sending email: ${JSON.stringify(error)}`);
  }
};

export const draftImageProcessingEmail = async (rotatedImageBuffer: Buffer) => {
  const draftEmail: MailOptions = {
    subject: 'Rotated Image',
    text: 'Hello, Please find the rotated image.',
    attachments: [
      {
        filename: 'rotated-image.png',
        content: rotatedImageBuffer,
      },
    ],
    from: SMTP_FROM,
    to: SMTP_TO,
  };

  await sendEmail(draftEmail);
};

export const draftImageProcessingErrorEmail = async (
  imageKey: string,
  error: string
) => {
  const draftEmail: MailOptions = {
    subject: `Image Processing failed for image key ${imageKey}`,
    text: error,
    from: SMTP_FROM,
    to: SMTP_TO_ADMIN,
  };

  await sendEmail(draftEmail);
};
