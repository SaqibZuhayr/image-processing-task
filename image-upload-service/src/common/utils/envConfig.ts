import dotenv from 'dotenv';
import { bool, cleanEnv, host, num, port, str, testOnly } from 'envalid';

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: testOnly('development'),
    choices: ['development', 'production', 'test'],
  }),
  HOST: host({ devDefault: testOnly('localhost') }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly('http://localhost:3000') }),
  DB_HOST: str({ devDefault: testOnly('localhost') }),
  DB_PORT: num({ devDefault: testOnly(5432) }),
  DB_USERNAME: str({ devDefault: testOnly('postgres') }),
  DB_PASSWORD: str({ devDefault: testOnly('postgres') }),
  DB_LOGGING: bool({ devDefault: testOnly(true) }),
  DB_NAME: str({ devDefault: testOnly('image-upload') }),
  AWS_ACCESS_KEY_ID: str(),
  AWS_SECRET_ACCESS_KEY: str(),
  S3_IMAGE_BUCKET_NAME: str(),
  AWS_ACCOUNT_ID: str(),
  AWS_REGION: str(),
  IMAGE_PROCESSING_QUEUE: str(),
  AWS_SQS_HOST: str(),
});
