import { Controller, Post, Get, Param, Body, Delete } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { Comment } from "./entities/comment.entity";

@Controller("comments")
export class CommentsController {
  constructor(private readonly commentService: CommentsService) { }

  @Post()
  async create(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  async findAll(): Promise<Comment[]> {
    return this.commentService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: number): Promise<Comment> {
    return this.commentService.findOne(id);
  }

  @Delete(":id")
  async remove(@Param("id") id: number): Promise<void> {
    return this.commentService.remove(id);
  }
}
