# Image Upload & Processing Services

## Overview

This project contains two main services: an **Image Upload Service** and an **Image Processing Service**. Both services work together to allow users to upload images, store them in AWS S3, add comments, and process those images based on messages from AWS SQS. The image processing includes rotating images and sending them via email.

### Image Upload Service

The **Image Upload Service** is a Node.js and TypeScript-based API that enables users to upload images to AWS S3 and store metadata in a PostgreSQL database. The service also supports adding comments to uploaded images and provides a RESTful or GraphQL API.

#### Features

- Users can upload images, which are stored in AWS S3.
- Users can add comments to existing images.
- Metadata about the uploaded images (e.g., description, upload time, comments) is stored in a PostgreSQL database.
- Uses TypeORM for database interaction, ensuring type safety and efficient query management.

### Image Processing Service

The **Image Processing Service** listens to an AWS SQS queue for messages, fetches images from S3, applies image processing (e.g., image rotation), and sends the processed images via email. It also includes error handling mechanisms and simulates intentional failures for testing.

#### Features

- Listens for messages from an AWS SQS queue.
- Fetches images from S3 based on the `imageKey` in the message.
- Rotates images by 180 degrees and apply greyscale using the Jimp image processing library.
- Sends processed images via email using SMTP services (e.g., Gmail).
- Deletes processed messages from the queue.
- Simulates a failure for every third image processing attempt.
- Sends error emails if image processing fails.

---

## Prerequisites

- **Node.js** (v18 or higher for Image Upload)
- **PostgreSQL**: Set up with the schema `image-upload`.
- **AWS SDK**: Configured AWS credentials with proper S3 and SQS permissions.
- **AWS S3 Bucket**: For image storage.
- **TypeScript**: Ensure TypeScript is installed globally or locally in the project.
- **Nodemailer**: For sending emails (in Image Processing Service).
- **SMTP Credentials**: For sending emails via SMTP (e.g., Gmail, Mailgun).

---

---

## How to trigger image processing failure case

### Every 3rd try including 0 will result in image processing failure case and error will be sent to admin.

---

## Installation

1. **Clone the repository**:
   'git clone https://github.com/SaqibZuhayr/image-processing'

### Image Upload Service

2. **Install dependencies**:
   'cd image-upload-service'
   'npm ci'

3. **Create `.env` file** with the following content:

   ```
    NODE_ENV=<development|production>
    PORT=<8080>
    HOST=<localhost>

    DB_HOST =<127.0.0.1>
    DB_PORT=<5432>
    DB_USERNAME=<postgres>
    DB_PASSWORD=<postgres>
    DB_NAME=<postgres>

    CORS_ORIGIN=<http://localhost:*>
    AWS_ACCESS_KEY_ID=<AWS Access Id Key>
    AWS_SECRET_ACCESS_KEY=<AWS Secret Key>
    S3_IMAGE_BUCKET_NAME= <S3 Bucket Name>
    AWS_ACCOUNT_ID=<AWS Acccount Id>
    AWS_REGION=<AWS Region>
    IMAGE_PROCESSING_QUEUE=<Queue Name>
    AWS_SQS_HOST=<AWS Sqs Host>
   ```

4. **Run Postgres database**:
   'docker run --name my-postgres-db -p 5432:5432 -e POSTGRES_USER=username -e POSTGRES_PASSWORD=password -d postgres'

5. **Create Image Upload**;
   Create `image-upload` schema in the postgres database

6. **Run migrations**:
   `npm run migration:run`

7. **Build the app**:
   `npm run build`
8. **Start the server**:
   `npm run start`

### Image Processing Service

2. _Install dependencies_:
   'cd image-processing-service'
   'npm ci'

3. **Create `.env` file** with the following content:

   ```
    NODE_ENV=<development|production>
    PORT=<8080>
    HOST=<localhost>

    DB_HOST =<127.0.0.1>
    DB_PORT=<5432>
    DB_USERNAME=<postgres>
    DB_PASSWORD=<postgres>
    DB_NAME=<postgres>

    CORS_ORIGIN=<http://localhost:*>
    AWS_ACCESS_KEY_ID=<AWS Access Id Key>
    AWS_SECRET_ACCESS_KEY=<AWS Secret Key>
    S3_IMAGE_BUCKET_NAME= <S3 Bucket Name>
    AWS_ACCOUNT_ID=<AWS Acccount Id>
    AWS_REGION=<AWS Region>
    IMAGE_PROCESSING_QUEUE=<Queue Name>
    AWS_SQS_HOST=<AWS Sqs Host>
    SMTP_HOST_NAME=<SMTP Host Name>
    SMTP_PORT=<SMPT Port>
    SMTP_USERNAME=<SMTP Username>
    SMTP_PASSWORD=<SMTP Password>
    SMTP_FROM=<SMTP From email>
    SMTP_TO=<Comma Seperated Email Ids to send email to> # Example: user1@example.com, user2@example.com
    SMTP_TO_ADMIN=<Send error email to>
   ```

4. **Build the app**:
   `npm run build`
5. **Start the server**:
   `npm run start`

### Using Docker

Running services using Docker

### Image Upload Service

1. `docker build -t image-upload-service .`
2. `docker run -p 8081:8081 --env-file .env image-upload-service`

### Image Processing Service

1. `docker build -t image-processing-service .`
2. `docker run --env-file .env image-processing-service`

---

## Swagger UI

### Once the application are running, you can access the Swagger UI on

`http://localhost:${port}/api-docs`

---

## Infrastructure Deployment with Terraform

Create and deploy AWS Infra using terraform:
Image Upload Service
Image Processing Service.
S3 bucket
SQS queue

### Steps to Deploy

1. **Build and Push Docker Images To ECR**

   ```bash
   $(aws ecr get-login-password --region <region>) | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com
   docker build -t image-upload-service .
   docker tag image-upload-service:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/image-upload-service:latest
   docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/image-upload-service:latest

   ```

   ```bash
   $(aws ecr get-login-password --region <region>) | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com
   docker build -t image-processing-service .
   docker tag image-processing-service:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/image-processing-service:latest
   docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/image-processing-service:latest
   ```

2. **Navigate to the 'deployment' directory**:
   `cd deployment`

3. **Initialize Terraform**:
   `terraform init`

4. **It will ask for values**:

   ```
   aws_access_key_id = "aws-access-key-id"
   aws_secret_access_key = "aws-secret-access-key"
   smtp_username     = "smtp username"
   smtp_password = "smtp password"
   ```

5. **Plan and apply the infrastructure**:
   `terraform plan`
   `terraform apply`

   ECS tasks for both services will be created.
