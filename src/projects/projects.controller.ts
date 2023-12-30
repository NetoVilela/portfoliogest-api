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
import { ProjectsService } from './projects.service';
import { UserLogged } from 'src/decorators/userLogged';
import TokenPayloadDto from 'src/auth/dtos/tokenPayload.dto';
import { CreateProjectDto } from './dtos/createProject.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateProjectDto } from './dtos/updateProject.dto';

@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @Get()
  async findAll(@UserLogged() userLogged: TokenPayloadDto) {
    return await this.projectService.findAll(userLogged);
  }

  @Post()
  async create(
    @Body() createProject: CreateProjectDto,
    @UserLogged() userLogged: TokenPayloadDto,
  ) {
    return await this.projectService.create(createProject, userLogged);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() projectUpdateData: UpdateProjectDto,
    @UserLogged() userLogged: TokenPayloadDto,
  ) {
    return this.projectService.update(id, projectUpdateData, userLogged);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @UserLogged() userLogged: TokenPayloadDto) {
    return this.projectService.delete(id, userLogged);
  }
}
