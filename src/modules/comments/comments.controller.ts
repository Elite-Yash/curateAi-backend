import { Controller, Post, Get, Param, Body, Delete, HttpStatus } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Post()
  async create(@Body() createCommentDto: CreateCommentDto) {
    const comment = await this.commentsService.create(createCommentDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Comment created successfully',
      data: comment,
    };
  }

  @Get()
  async findAll() {
    const comments = await this.commentsService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Comments retrieved successfully',
      data: comments,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const comment = await this.commentsService.findOne(id);
    if (!comment) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Comment not found',
        data: null,
      };
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Comment retrieved successfully',
      data: comment,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.commentsService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Comment deleted successfully',
    };
  }
}
