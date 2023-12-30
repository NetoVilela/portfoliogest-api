import { CreatePortfolioDto } from './dtos/createPortfolio.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PortfolioEntity } from './interfaces/portfolio.entity';
import { DeleteResult, Repository } from 'typeorm';
import TokenPayloadDto from 'src/auth/dtos/tokenPayload.dto';
import { UpdatePortfolioDto } from './dtos/updatePortfolio.dto';

@Injectable()
export class PortfoliosService {
  constructor(
    @InjectRepository(PortfolioEntity)
    private readonly portfolioRepository: Repository<PortfolioEntity>,
  ) {}

  async findAll(userLogged: TokenPayloadDto) {
    const { userId, profileId } = userLogged;

    if (profileId === 1) {
      return await this.portfolioRepository
        .createQueryBuilder('portfolio')
        .innerJoinAndSelect('portfolio.user', 'user')
        .select(['portfolio', 'user.id', 'user.name'])
        .where({})
        .getMany();
    } else {
      return await this.portfolioRepository
        .createQueryBuilder('portfolio')
        .innerJoinAndSelect('portfolio.user', 'user')
        .select(['portfolio', 'user.id', 'user.name'])
        .where({
          user: {
            id: userId,
          },
        })
        .getMany();
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

  async update(
    id: string,
    portfolioUpdateData: UpdatePortfolioDto,
    userLogged: TokenPayloadDto,
  ) {
    const { userId, profileId } = userLogged;

    const portfolio = await this.portfolioRepository.findOne({
      where: {
        id,
      },
    });

    if (profileId !== 1 && portfolio.userId !== userId) {
      throw new HttpException(
        `Somente administradores podem editar Portfólios de outros usuários`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.portfolioRepository.update(id, {
      ...portfolioUpdateData,
      updatedAt: new Date(),
    });

    return await this.portfolioRepository.findOne({
      where: {
        id,
      },
    });
  }

  async delete(id: string, userLogged: TokenPayloadDto): Promise<DeleteResult> {
    const { profileId, userId } = userLogged;

    const portfolio = await this.portfolioRepository.findOne({
      where: {
        id,
      },
    });

    if (profileId !== 1 && portfolio.userId !== userId) {
      throw new HttpException(
        `Somente administradores podem remover Portfólios de outros usuários`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return await this.portfolioRepository.delete(id);
  }
}
