import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comment } from "./entities/comment.entity";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>, // Inject Repository
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentRepository.create(createCommentDto);
    return this.commentRepository.save(comment);
  }

  async findAll(user_id: number): Promise<Comment[]> {
    return this.commentRepository.find({ where: { 'user_id': user_id } });
  }

  async findOne(id: number): Promise<Comment> {
    return this.commentRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.commentRepository.delete(id);
  }
}
