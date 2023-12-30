import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KnowledgeEntity } from './interfaces/knowledge.entity';
import { Repository } from 'typeorm';
import { CreateKnowledgeDto } from './dtos/createKnowledge.dto';
import { UserLogged } from 'src/decorators/userLogged';

@Injectable()
export class KnowledgesService {
  constructor(
    @InjectRepository(KnowledgeEntity)
    private readonly knowledgeRepository: Repository<KnowledgeEntity>,
  ) {}

  async findAll() {
    return this.knowledgeRepository.find();
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
}
