import { Module } from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { ExperiencesController } from './experiences.controller';
import { ExperienceEntity } from './interfaces/experiences.entity';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ExperienceEntity]), JwtModule],
  providers: [ExperiencesService],
  controllers: [ExperiencesController],
})
export class ExperiencesModule {}
