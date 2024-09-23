import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Images } from './images';

@Entity({ schema: 'image-upload' })
export class Comments extends BaseEntity {
  @Column({ type: 'text' })
  content!: string;

  @ManyToOne(() => Images, (image) => image.comments, {
    onDelete: 'CASCADE', // If an image is deleted, delete related comments too
  })
  image!: Images;
}
