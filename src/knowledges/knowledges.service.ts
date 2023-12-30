import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KnowledgeEntity } from './interfaces/knowledge.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateKnowledgeDto } from './dtos/createKnowledge.dto';
import { UserLogged } from 'src/decorators/userLogged';
import TokenPayloadDto from 'src/auth/dtos/tokenPayload.dto';
import { UpdateKnowledgeDto } from './dtos/updateKnowledge.dto';

@Injectable()
export class KnowledgesService {
  constructor(
    @InjectRepository(KnowledgeEntity)
    private readonly knowledgeRepository: Repository<KnowledgeEntity>,
  ) {}

  async findAll(userLogged: TokenPayloadDto) {
    const { profileId, userId } = userLogged;

    if (profileId === 1) {
      return await this.knowledgeRepository
        .createQueryBuilder('knowledges')
        .innerJoinAndSelect('knowledges.user', 'user')
        .select([
          'knowledges.id',
          'knowledges.createdAt',
          'knowledges.updatedAt',
          'knowledges.status',
          'knowledges.name',
          'knowledges.description',
          'knowledges.level',
          'user.id',
          'user.name',
        ])
        .getMany();
    } else {
      return await this.knowledgeRepository
        .createQueryBuilder('knowledges')
        .innerJoinAndSelect('knowledges.user', 'user')
        .select([
          'knowledges.id',
          'knowledges.createdAt',
          'knowledges.updatedAt',
          'knowledges.status',
          'knowledges.name',
          'knowledges.description',
          'knowledges.level',
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
    createKnowledgeDto: CreateKnowledgeDto,
    @UserLogged() userLogged,
  ) {
    const { userId } = userLogged;
    const { name, level } = createKnowledgeDto;

    if (level < 0 || level > 10) {
      throw new HttpException(
        "Parâmetro 'level' deve ser um valor entre 0 e 10.",
        HttpStatus.BAD_REQUEST,
      );
    }

    const knowledgeExist = await this.knowledgeRepository
      .createQueryBuilder('k')
      .where('k.user.id = :userId AND k.name = :name', {
        userId,
        name,
      })
      .getMany();

    if (knowledgeExist.length > 0) {
      throw new HttpException(
        `Já existe um conhecimento com o nome ${name} para esse usuário.`,
        HttpStatus.CONFLICT,
      );
    }

    const newKnowledge = this.knowledgeRepository.create({
      ...createKnowledgeDto,
      createdAt: new Date(),
      user: { id: userId },
    });

    await this.knowledgeRepository.save(newKnowledge);

    return {
      id: newKnowledge.id,
      name: newKnowledge.name,
      description: newKnowledge.description,
      level: newKnowledge.level,
    };
  }

  async update(
    id: string,
    knowledgeUpdateData: UpdateKnowledgeDto,
    userLogged: TokenPayloadDto,
  ) {
    const { userId, profileId } = userLogged;

    const knowledge = await this.knowledgeRepository.findOne({
      where: {
        id,
      },
    });

    if (profileId !== 1 && knowledge.userId !== userId) {
      throw new HttpException(
        `Somente administradores podem editar conhecimentos de outros usuários`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.knowledgeRepository.update(id, {
      ...knowledgeUpdateData,
      updatedAt: new Date(),
    });

    return await this.knowledgeRepository.findOne({
      where: {
        id,
      },
    });
  }

  async delete(id: string, userLogged: TokenPayloadDto): Promise<DeleteResult> {
    const { profileId, userId } = userLogged;

    const knowledge = await this.knowledgeRepository.findOne({
      where: {
        id,
      },
    });

    if (profileId !== 1 && knowledge.userId !== userId) {
      throw new HttpException(
        `Somente administradores podem remover conhecimentos de outros usuários`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return await this.knowledgeRepository.delete(id);
  }
}
