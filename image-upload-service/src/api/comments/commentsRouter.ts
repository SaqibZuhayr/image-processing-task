import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { addCommentSchema } from '@/api/comments/commentsModel';
import { validateRequest } from '@/common/utils/httpHandlers';
import { addCommentToImage } from './commentsController';

export const commentsRegistry = new OpenAPIRegistry();
export const commentsRouter: Router = express.Router();

commentsRegistry.registerPath({
  method: 'post',
  description: 'Add comment against an image',
  path: '/comments/image/{id}',
  tags: ['Comments'],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      description: 'ID of the image to which the comment is added',
      schema: {
        type: 'string', // or 'string' if you're treating the ID as a string
        example: 1,
      },
    },
  ],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              description: 'Content of the comment',
            },
          },
          required: ['content'], // Specify required properties
        },
      },
    },
  },
  responses: createApiResponse(z.array(addCommentSchema), 'Success'),
});

commentsRouter.post(
  '/image/:id',
  validateRequest(addCommentSchema),
  addCommentToImage
);
