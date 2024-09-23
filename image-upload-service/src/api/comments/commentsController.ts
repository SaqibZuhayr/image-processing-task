import { Request, Response } from 'express';
import { commentService } from './commentsService';
import { uploadToS3 } from '../../utils/s3';

// Add comment to an image
export const addCommentToImage = async (req: Request, res: Response) => {
  const imageId = req.params.id;
  const { content } = req.body;

  try {
    const newComment = await commentService.postComment(imageId, content);

    return res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: newComment,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message,
    });
  }
};
