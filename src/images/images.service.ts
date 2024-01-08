import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from './interfaces/image.entity';
import { Repository } from 'typeorm';
import { CreateAvatarDto } from './dtos/createAvatar.dto';
import { UsersService } from 'src/users/users.service';

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
}
