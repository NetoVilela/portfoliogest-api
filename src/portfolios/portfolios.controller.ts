import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { UserLogged } from 'src/decorators/userLogged';
import TokenPayloadDto from 'src/auth/dtos/tokenPayload.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CreatePortfolioDto } from './dtos/createPortfolio.dto';

@UseGuards(AuthGuard)
@Controller('portfolios')
export class PortfoliosController {
  constructor(private readonly portfolioService: PortfoliosService) {}

  @Get()
  async getAllPortfolios(@UserLogged() userLogged: TokenPayloadDto) {
    return this.portfolioService.findAll(userLogged);
  }

  @Post()
  async createPortfolio(
    @Body() createPortfolio: CreatePortfolioDto,
    @UserLogged() userLogged: TokenPayloadDto,
  ) {
    return this.portfolioService.createPortfolio(createPortfolio, userLogged);
  }
}
