import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PortFolioEntity } from './interfaces/portfolio.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PortfoliosService {
  constructor(
    @InjectRepository(PortFolioEntity)
    private readonly portfolioRepository: Repository<PortFolioEntity>,
  ) {}

  async findAll() {
    return this.portfolioRepository.find();
  }
}
