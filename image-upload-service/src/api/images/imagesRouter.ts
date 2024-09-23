import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { imageUploadSchema } from '@/api/images/imagesModel';
import { validateRequest } from '@/common/utils/httpHandlers';
import { addImage } from './imagesController';
import { uploadImage } from '@/utils/multer';

export const imagesRegistry = new OpenAPIRegistry();
export const imagesRouter: Router = express.Router();

imagesRegistry.registerPath({
  method: 'post',
  description: 'Upload Image',
  path: '/images/',
  tags: ['Images'],
  requestBody: {
    required: true,
    content: {
      'multipart/form-data': {
        schema: {
          type: 'object',
          properties: {
            description: {
              type: 'string',
              description: 'Optional description of the image',
            },
            image: {
              type: 'string',
              format: 'binary', // Indicates that this field should be a file
              description: 'The image file to upload',
            },
          },
          required: ['image'], // Image is a required field
        },
      },
    },
  },
  responses: createApiResponse(z.array(imageUploadSchema), 'Success'),
});

imagesRouter.post(
  '/',
  uploadImage,
  validateRequest(imageUploadSchema),
  addImage
);
