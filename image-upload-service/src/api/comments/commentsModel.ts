import { commonValidations } from '@/common/utils/commonValidation';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const addCommentSchema = z.object({
  params: z.object({
    id: commonValidations.id,
  }),
  body: z.object({
    content: z.string({
      message: 'comment is required',
    }),
  }),
});
