import AdminJS from 'adminjs';
// без этого `@adminjs/nestjs` по какой-то причине "не видит" `@aminjs/express`, необходимый ему для работы
import '@adminjs/express';
import { AdminModule } from '@adminjs/nestjs';
import { Database, Resource } from '@adminjs/prisma';
// мы не можем использовать `User` и `Post` из `@prisma/client`,
// поскольку нам нужны модели, а не типы,
// поэтому приходится делать так
import { PrismaClient } from '@prisma/client';
import uploadFeature from '@adminjs/upload'
import { DMMFClass } from '@prisma/client/runtime';
1;

const prisma = new PrismaClient();
const dmmf = (prisma as any)._dmmf as DMMFClass;

const contentParent = {
  name: 'Контент',
  icon: 'Accessibility',
}

AdminJS.registerAdapter({ Database, Resource });

export default AdminModule.createAdmin({
  adminJsOptions: {
    // путь к админке
    rootPath: '/admin',
    // в этом списке должны быть указаны все модели/таблицы БД,
    // доступные для редактирования
    resources: [
      {
        resource: { model: dmmf.modelMap.User, client: prisma },
        options: { parent: contentParent }
      },
      {
        resource: { model: dmmf.modelMap.Post, client: prisma },
        options: { parent: contentParent }
      },
      {
        resource: { model: dmmf.modelMap.Media, client: prisma },
        options: {
          listProperties: ['id', 'name', 'url', 'file']
        },
        features: [uploadFeature({
          provider: {
            aws: {
              accessKeyId: process.env.AWS_ACCESS_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
              region: 'eu-north-1',
              bucket: 'tabloid-media',
            }
          },
          properties: {
            filePath: `Media.url`,
            key: 'url', // to this db field feature will safe S3 key
            mimeType: 'mimeType' // this property is important because allows to have previews
          },
          validation: {
            mimeTypes: ['image/jpeg', 'image/png', 'video/mp4']
          }
        })]
      }
    ],
  },
});