import { Controller, Post, Get, Param, Body, Delete, HttpStatus, Req, Patch } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Post()
  async create(@Req() req: Request, @Body() createCommentDto: CreateCommentDto) {
    const currentUser = req['user'];
    createCommentDto.user_id = currentUser.id;

    const comment = await this.commentsService.create(createCommentDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Comment created successfully',
      data: comment,
    };
  }

  @Get()
  async findAll(@Req() req: Request) {
    const currentUser = req['user'];
    const comments = await this.commentsService.findAll(currentUser.id);
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

  @Patch(':id/post-url')
  async updateCommentUrl(
    @Param('id') id: number,
    @Body() { post_url }: UpdateCommentDto,
  ) {
    if (!post_url) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'post_url is required',
        data: null,
      };
    }

    const updatedComment = await this.commentsService.updateCommentUrl(
      id,
      post_url,
    );

    if (!updatedComment) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Comment not found or already posted',
        data: null,
      };
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Comment updated successfully',
      data: updatedComment,
    };
  }

}
