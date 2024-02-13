import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from './interfaces/image.entity';
import { Repository } from 'typeorm';
import { CreateAvatarDto } from './dtos/createAvatar.dto';
import { UsersService } from 'src/users/users.service';
import * as fs from 'fs';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imagesRepository: Repository<ImageEntity>,
    private readonly usersService: UsersService,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async uploadAvatar(
    file: Express.Multer.File,
    createAvatarDto: CreateAvatarDto,
  ) {
    const { filename, originalname, size, mimetype, path } = file;
    const { userId } = createAvatarDto;

    const newImage = this.imagesRepository.create({
      createdAt: new Date(),
      originalFileName: originalname,
      fileName: filename,
      size,
      contentType: mimetype,
      filePath: path.replace('dist/', ''),
    });

    const avatar = await this.imagesRepository.save(newImage);

    await this.usersService.saveDataAvatar(userId, avatar);

    return avatar;
  }

  async removeAvatar(id: string) {
    const image = await this.imagesRepository.findOne({
      where: {
        id,
      },
    });

    if (!image) {
      throw new HttpException(
        `Não foi possível remover o avatar. Arquivo não encontrado.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    fs.unlink(`${image.filePath}`, (err) => {
      console.log(err);
      if (err) {
        throw new HttpException(
          `Houve um erro ao remover a imagem: ${err}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    });

    const sqlUpdateUser = `UPDATE users SET image_id = null WHERE image_id = '${id}'`;
    await this.imagesRepository.query(sqlUpdateUser);

    return await this.imagesRepository.delete(id);
  }
}
