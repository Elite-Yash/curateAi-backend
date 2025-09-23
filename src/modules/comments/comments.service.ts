import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>, // Inject Repository
  ) { }

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentRepository.create(createCommentDto);
    const saveData = await this.commentRepository.save(comment);
    return saveData;
  }

  async findAll(user_id: number): Promise<Comment[]> {
    return this.commentRepository.find({ where: { user_id: user_id } });
  }

  async findOne(id: number): Promise<Comment> {
    return this.commentRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.commentRepository.delete(id);
  }

  async updateCommentUrl(id: number, postUrl: string): Promise<Comment | null> {
    const comment = await this.commentRepository.findOne({
      where: { id, post_url: null, is_comment_posted: false },
    });

    if (!comment) {
      return null; // not found or already posted
    }

    comment.post_url = postUrl;
    comment.is_comment_posted = true;

    return await this.commentRepository.save(comment);
  }

}
