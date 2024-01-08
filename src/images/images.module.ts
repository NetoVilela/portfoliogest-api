import { Module } from '@nestjs/common';
import { FilesController } from './images.controller';
import { ImagesService } from './images.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './interfaces/image.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity]), UsersModule, JwtModule],
  controllers: [FilesController],
  providers: [ImagesService],
})
export class ImagesModule {}
