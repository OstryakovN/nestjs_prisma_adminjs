import { Injectable } from '@nestjs/common';
// преимущество использования `Prisma` в `TypeScript-проекте` состоит в том,
// что `Prisma` автоматически генерирует типы для моделей и их вариаций
import { User, Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';

type GetPostsParams = {
  skip?: number;
  take?: number;
  cursor?: Prisma.PostWhereUniqueInput;
  where?: Prisma.PostWhereInput;
  orderBy?: Prisma.PostOrderByWithRelationInput;
};

@Injectable()
export class UserService {
  // внедряем зависимость
  constructor(private prisma: PrismaService) { }

  // получение пользователя по email
  async getUser(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where
    });
  }

  // получение всех пользователей
  async users(params: GetPostsParams): Promise<User[]> {
    return this.prisma.user.findMany({ ...params });
  }

  // создание пользователя
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  // обновление пользователя
  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  // удаление пользователя
  async removeUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({ where });
  }
}