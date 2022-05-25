import {
  Controller,
  Query,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PostService } from './post.service';
import { User as UserModel, Post as PostModel, Prisma } from '@prisma/client';

type UserData = { email: string; name?: string };

type PostData = {
  title: string;
  content?: string;
  authorEmail: string;
};

type GetPostsParams = {
  skip?: number;
  take?: number;
  cursor?: Prisma.PostWhereUniqueInput;
  where?: Prisma.PostWhereInput;
  orderBy?: Prisma.PostOrderByWithRelationInput;
};

// добавляем префикс пути
@Controller('api')
export class AppController {
  constructor(
    // внедряем зависимости
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) { }


  @Get('users')
  async getAllUsers(@Query() query: GetPostsParams): Promise<UserModel[]> {
    return this.userService.users(query)
  }

  @Get('user/:email')
  async getUserByEmail(@Param('email') email: string): Promise<UserModel> {
    return this.userService.getUser({ email })
  }

  @Get('post/:id')
  async getPostById(@Param('id') id: string): Promise<PostModel> {
    return this.postService.post({ id: Number(id) });
  }

  @Get('feed')
  async getPublishedPosts(): Promise<PostModel[]> {
    return this.postService.posts({
      where: {
        published: true,
      },
    });
  }

  @Get('filtered-posts/:searchString')
  async getFilteredPosts(
    @Param('searchString') searchString: string,
  ): Promise<PostModel[]> {
    return this.postService.posts({
      where: {
        OR: [
          {
            title: { contains: searchString },
          },
          {
            content: { contains: searchString },
          },
        ],
      },
    });
  }

  @Post('post')
  async createDraft(@Body() postData: PostData): Promise<PostModel> {
    const { title, content, authorEmail } = postData;

    return this.postService.createPost({
      title,
      content,
      author: {
        connect: { email: authorEmail },
      },
    });
  }

  @Put('publish/:id')
  async publishPost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.updatePost({
      where: { id: Number(id) },
      data: { published: true },
    });
  }

  @Delete('post/:id')
  async removePost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.removePost({ id: Number(id) });
  }

  @Post('user')
  async registerUser(@Body() userData: UserData): Promise<UserModel> {
    return this.userService.createUser(userData);
  }
}