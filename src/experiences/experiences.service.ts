import { InjectRepository } from '@nestjs/typeorm';
import { ExperienceEntity } from './interfaces/experiences.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateExperienceDto } from './dtos/createExperience.dto';
import TokenPayloadDto from 'src/auth/dtos/tokenPayload.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateExperienceDto } from './dtos/updateExperience.dto';

export class ExperiencesService {
  constructor(
    @InjectRepository(ExperienceEntity)
    private readonly experiencesRepository: Repository<ExperienceEntity>,
  ) {}

  async findAll(userLogged: TokenPayloadDto) {
    const { profileId, userId } = userLogged;

    if (profileId === 1) {
      return await this.experiencesRepository
        .createQueryBuilder('e')
        .innerJoinAndSelect('e.user', 'user')
        .select([
          'e.id',
          'e.createdAt',
          'e.updatedAt',
          'e.status',
          'e.name',
          'e.description',
          'e.companyName',
          'e.monthStart',
          'e.yearStart',
          'e.monthEnd',
          'e.yearEnd',
          'e.currentJob',
          'user.id',
          'user.name',
        ])
        .getMany();
    } else {
      return await this.experiencesRepository
        .createQueryBuilder('e')
        .innerJoinAndSelect('e.user', 'user')
        .select([
          'e.id',
          'e.createdAt',
          'e.updatedAt',
          'e.status',
          'e.name',
          'e.description',
          'e.companyName',
          'e.monthStart',
          'e.yearStart',
          'e.monthEnd',
          'e.yearEnd',
          'e.currentJob',
          'user.id',
          'user.name',
        ])
        .where({
          user: {
            id: userId,
          },
        })
        .getMany();
    }
  }

  async create(
    createExperience: CreateExperienceDto,
    userLogged: TokenPayloadDto,
  ) {
    const { userId } = userLogged;
    const { name, companyName } = createExperience;

    const exprienceExist = await this.experiencesRepository
      .createQueryBuilder('p')
      .where('p.user.id = :userId AND p.name = :name', {
        userId,
        name,
        companyName,
      })
      .getMany();

    if (exprienceExist.length > 0) {
      throw new HttpException(
        `Já existe essa Experiência profissional com essa empresa.`,
        HttpStatus.CONFLICT,
      );
    }

    const newExperience = this.experiencesRepository.create({
      ...createExperience,
      createdAt: new Date(),
      user: { id: userId },
    });

    await this.experiencesRepository.save(newExperience);

    return {
      ...newExperience,
      userId: undefined,
    };
  }

  async update(
    id: string,
    experienceUpdateData: UpdateExperienceDto,
    userLogged: TokenPayloadDto,
  ) {
    const { userId, profileId } = userLogged;

    const experience = await this.experiencesRepository.findOne({
      where: {
        id,
      },
    });

    if (profileId !== 1 && experience.userId !== userId) {
      throw new HttpException(
        `Somente administradores podem editar Experiências profissionais de outros usuários`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.experiencesRepository.update(id, {
      ...experienceUpdateData,
      updatedAt: new Date(),
    });

    return await this.experiencesRepository.findOne({
      where: {
        id,
      },
    });
  }

  async delete(id: string, userLogged: TokenPayloadDto): Promise<DeleteResult> {
    const { profileId, userId } = userLogged;

    const experience = await this.experiencesRepository.findOne({
      where: {
        id,
      },
    });

    if (profileId !== 1 && experience.userId !== userId) {
      throw new HttpException(
        `Somente administradores podem remover Experiências profissionais de outros usuários`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return await this.experiencesRepository.delete(id);
  }
}
