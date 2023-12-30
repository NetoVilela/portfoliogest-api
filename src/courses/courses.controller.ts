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
import { CoursesService } from './courses.service';
import { UserLogged } from 'src/decorators/userLogged';
import TokenPayloadDto from 'src/auth/dtos/tokenPayload.dto';
import { CreateCourseDto } from './dtos/createCourse.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateCourseDto } from './dtos/updateCourse.dto';

@UseGuards(AuthGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async findAll(@UserLogged() userLogged: TokenPayloadDto) {
    return await this.coursesService.findAll(userLogged);
  }

  @Post()
  async create(
    @Body() createCourse: CreateCourseDto,
    @UserLogged() userLogged: TokenPayloadDto,
  ) {
    return await this.coursesService.create(createCourse, userLogged);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCourse: UpdateCourseDto,
    @UserLogged() userLogged: TokenPayloadDto,
  ) {
    return this.coursesService.update(id, updateCourse, userLogged);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @UserLogged() userLogged: TokenPayloadDto) {
    return this.coursesService.delete(id, userLogged);
  }
}
