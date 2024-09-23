import { AppDataSource } from '../../database/dataSource'; // Your data source setup
import { Comments } from '../../database/entities/comments';
import { imagesService } from '../images/ImagesService';

class CommentsService {
  async postComment(imageId: string, content: string) {
    const image = await imagesService.fetchImageById(parseInt(imageId));
    if (!image?.id) throw new Error(`Image ${imageId} not found`);
    const comment = new Comments();
    comment.content = content;
    comment.image = image;

    return await AppDataSource.getRepository(Comments).save(comment);
  }
}

export const commentService = new CommentsService();
