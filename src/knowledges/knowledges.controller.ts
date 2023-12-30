import { AuthGuard } from 'src/auth/auth.guard';
import { KnowledgesService } from './knowledges.service';
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
import { CreateKnowledgeDto } from './dtos/createKnowledge.dto';
import TokenPayloadDto from 'src/auth/dtos/tokenPayload.dto';
import { UserLogged } from 'src/decorators/userLogged';
import { UpdateKnowledgeDto } from './dtos/updateKnowledge.dto';

@UseGuards(AuthGuard)
@Controller('knowledges')
export class KnowledgesController {
  constructor(private readonly knowledgesService: KnowledgesService) {}

  @Get()
  findAll(@UserLogged() userLogged: TokenPayloadDto) {
    return this.knowledgesService.findAll(userLogged);
  }

  @Post()
  create(
    @Body() createKnowledgeDto: CreateKnowledgeDto,
    @UserLogged() userLogged: TokenPayloadDto,
  ) {
    return this.knowledgesService.create(createKnowledgeDto, userLogged);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() knowledgeUpdateData: UpdateKnowledgeDto,
    @UserLogged() userLogged: TokenPayloadDto,
  ) {
    return this.knowledgesService.update(id, knowledgeUpdateData, userLogged);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @UserLogged() userLogged: TokenPayloadDto) {
    return this.knowledgesService.delete(id, userLogged);
  }
}
