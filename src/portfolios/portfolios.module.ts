import { Module } from '@nestjs/common';
import { PortfoliosController } from './portfolios.controller';
import { PortfoliosService } from './portfolios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortFolioEntity } from './interfaces/portfolio.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([PortFolioEntity]), JwtModule],
  controllers: [PortfoliosController],
  providers: [PortfoliosService],
})
export class PortfoliosModule {}
