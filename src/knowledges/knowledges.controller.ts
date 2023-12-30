import { AuthGuard } from 'src/auth/auth.guard';
import { KnowledgesService } from './knowledges.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateKnowledgeDto } from './dtos/createKnowledge.dto';
import TokenPayloadDto from 'src/auth/dtos/tokenPayload.dto';
import { UserLogged } from 'src/decorators/userLogged';

@UseGuards(AuthGuard)
@Controller('knowledges')
export class KnowledgesController {
  constructor(private readonly knowledgesService: KnowledgesService) {}

  @Get()
  findAll() {
    return this.knowledgesService.findAll();
  }

  @Post()
  create(
    @Body() createKnowledgeDto: CreateKnowledgeDto,
    @UserLogged() userLogged: TokenPayloadDto,
  ) {
    return this.knowledgesService.create(createKnowledgeDto, userLogged);
  }
}
