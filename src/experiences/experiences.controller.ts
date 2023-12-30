import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { UserLogged } from 'src/decorators/userLogged';
import TokenPayloadDto from 'src/auth/dtos/tokenPayload.dto';
import { CreateExperienceDto } from './dtos/createExperience.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateExperienceDto } from './dtos/updateExperience.dto';

@UseGuards(AuthGuard)
@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Get()
  async findAll(@UserLogged() userLogged: TokenPayloadDto) {
    return await this.experiencesService.findAll(userLogged);
  }

  @Post()
  async create(
    @Body() createExperience: CreateExperienceDto,
    @UserLogged() userLogged: TokenPayloadDto,
  ) {
    return await this.experiencesService.create(createExperience, userLogged);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateExperience: UpdateExperienceDto,
    @UserLogged() userLogged: TokenPayloadDto,
  ) {
    return this.experiencesService.update(id, updateExperience, userLogged);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @UserLogged() userLogged: TokenPayloadDto) {
    return this.experiencesService.delete(id, userLogged);
  }
}
