import { CreatePortfolioDto } from './dtos/createPortfolio.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PortFolioEntity } from './interfaces/portfolio.entity';
import { Repository } from 'typeorm';
import TokenPayloadDto from 'src/auth/dtos/tokenPayload.dto';

@Injectable()
export class PortfoliosService {
  constructor(
    @InjectRepository(PortFolioEntity)
    private readonly portfolioRepository: Repository<PortFolioEntity>,
  ) {}

  async findAll(userLogged: TokenPayloadDto) {
    const { userId, profileId } = userLogged;
    if (profileId === 1) {
      return this.portfolioRepository.find();
    } else {
      return this.portfolioRepository.find({
        where: {
          user: {
            id: userId,
          },
        },
      });
    }
  }

  async createPortfolio(
    createPortfolioDto: CreatePortfolioDto,
    userLogged: TokenPayloadDto,
  ) {
    const { userId } = userLogged;
    const { name } = createPortfolioDto;

    const portfolioExist = await this.portfolioRepository
      .createQueryBuilder('portfolio')
      .where('portfolio.user.id = :userId AND portfolio.name = :name', {
        userId,
        name,
      })
      .getMany();

    if (portfolioExist.length > 0) {
      throw new HttpException(
        `Já existe um portfólio com esse nome para esse usuário. Por favor, escolha outro nome e tente novamente.`,
        HttpStatus.CONFLICT,
      );
    }

    const newPortfolio = this.portfolioRepository.create({
      ...createPortfolioDto,
      createdAt: new Date(),
      user: { id: userId },
    });

    const savedPortfolio = await this.portfolioRepository.save(newPortfolio);

    return savedPortfolio;
  }
}
