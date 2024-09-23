import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Comments } from './comments';

@Entity({ schema: 'image-upload' })
export class Images extends BaseEntity {
  @Column({ type: 'text' })
  url!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => Comments, (comment) => comment.image, {
    cascade: true, // Cascade saves and updates for related comments
  })
  comments!: Comments[]; // Comments associated with the image
}
