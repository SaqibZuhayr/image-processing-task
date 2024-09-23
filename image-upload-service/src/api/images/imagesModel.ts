import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { validateRequest } from '@/common/utils/httpHandlers';

import { commonValidations } from '@/common/utils/commonValidation';

extendZodWithOpenApi(z);

// export type Image = z.infer<typeof ImageSchema>;
// export const ImageSchema = z.object({
//   id: z.number(),
//   description: z.string(),
//   url: z.string(),
//   createdAt: z.date(),
//   updatedAt: z.date(),
// });

// Define allowed MIME types
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

export const imageUploadSchema = z.object({
  body: z.object({
    description: z.string().optional(),
  }),
  file: z
    .any()
    .refine((file) => file && file.size > 0, {
      message: 'Image is required',
    })
    .refine(
      (file) => {
        if (!file) return false; // Check if file is defined
        return allowedImageTypes.includes(file.mimetype);
      },
      {
        message: 'Unsupported file type. Allowed types are: jpeg, png, gif',
      }
    ),
});
