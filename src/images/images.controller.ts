import { AuthGuard } from 'src/auth/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { CreateAvatarDto } from './dtos/createAvatar.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ImagesService } from './images.service';
import * as fs from 'fs';

@UseGuards(AuthGuard)
@Controller('images')
export class FilesController {
  constructor(private readonly imagesService: ImagesService) { }

  @Post('upload-avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './dist/uploads/avatars/',
        filename: (req, file, callback) => {
          // eslint-disable-next-line prettier/prettier
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');

          callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: '.(jpg|JPG|jpeg|JPEG|png|PNG)',
        })
        .addMaxSizeValidator({
          maxSize: 10 * 1024 * 1024, // 10MB
          message: 'Tamanho máximo de arquivo permitido: 10MB',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Body() body: CreateAvatarDto,
  ) {
    if (!body.userId) {
      fs.unlink(`${file.path}`, (err) => {
        console.log(
          `Usuário não encontrado, removendo imagem salva previamente... `,
        );
        if (err) {
          console.log(`Erro ao deletar imagem anexada previamente.`);
          console.error(err);
          return false;
        }
      });

      throw new HttpException(
        'Necessário informar o userId',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.imagesService.uploadAvatar(file, body);
  }

  @Delete('remove-avatar/:id')
  async removeAvatar(@Param('id') id: string) {
    return await this.imagesService.removeAvatar(id, );
  }
}
