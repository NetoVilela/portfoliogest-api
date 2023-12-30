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
import { PortfoliosService } from './portfolios.service';
import { UserLogged } from 'src/decorators/userLogged';
import TokenPayloadDto from 'src/auth/dtos/tokenPayload.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CreatePortfolioDto } from './dtos/createPortfolio.dto';
import { UpdatePortfolioDto } from './dtos/updatePortfolio.dto';

@UseGuards(AuthGuard)
@Controller('portfolios')
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @Get()
  async getAllPortfolios(@UserLogged() userLogged: TokenPayloadDto) {
    return this.portfoliosService.findAll(userLogged);
  }

  @Post()
  async createPortfolio(
    @Body() createPortfolio: CreatePortfolioDto,
    @UserLogged() userLogged: TokenPayloadDto,
  ) {
    return this.portfoliosService.createPortfolio(createPortfolio, userLogged);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePortfolio: UpdatePortfolioDto,
    @UserLogged() userLogged: TokenPayloadDto,
  ) {
    return this.portfoliosService.update(id, updatePortfolio, userLogged);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @UserLogged() userLogged: TokenPayloadDto) {
    return this.portfoliosService.delete(id, userLogged);
  }
}
