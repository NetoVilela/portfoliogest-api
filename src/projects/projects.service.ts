import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from './interfaces/projects.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateProjectDto } from './dtos/createProject.dto';
import TokenPayloadDto from 'src/auth/dtos/tokenPayload.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateProjectDto } from './dtos/updateProject.dto';

export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectsRepository: Repository<ProjectEntity>,
  ) {}

  async findAll(userLogged: TokenPayloadDto) {
    const { profileId, userId } = userLogged;

    if (profileId === 1) {
      return await this.projectsRepository
        .createQueryBuilder('p')
        .innerJoinAndSelect('p.user', 'user')
        .select([
          'p.id',
          'p.createdAt',
          'p.updatedAt',
          'p.status',
          'p.name',
          'p.description',
          'p.finished',
          'p.link',
          'user.id',
          'user.name',
        ])
        .getMany();
    } else {
      return await this.projectsRepository
        .createQueryBuilder('p')
        .innerJoinAndSelect('p.user', 'user')
        .select([
          'p.id',
          'p.createdAt',
          'p.updatedAt',
          'p.status',
          'p.name',
          'p.description',
          'p.finished',
          'p.link',
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

  async create(createProject: CreateProjectDto, userLogged: TokenPayloadDto) {
    const { userId } = userLogged;
    const { name } = createProject;

    const projectExist = await this.projectsRepository
      .createQueryBuilder('p')
      .where('p.user.id = :userId AND p.name = :name', {
        userId,
        name,
      })
      .getMany();

    if (projectExist.length > 0) {
      throw new HttpException(
        `Já existe um projecto com o nome ${name} para esse usuário.`,
        HttpStatus.CONFLICT,
      );
    }

    const newProject = this.projectsRepository.create({
      ...createProject,
      createdAt: new Date(),
      user: { id: userId },
    });

    await this.projectsRepository.save(newProject);

    return {
      ...newProject,
    };
  }

  async update(
    id: string,
    projectUpdateData: UpdateProjectDto,
    userLogged: TokenPayloadDto,
  ) {
    const { userId, profileId } = userLogged;

    const project = await this.projectsRepository.findOne({
      where: {
        id,
      },
    });

    if (profileId !== 1 && project.userId !== userId) {
      throw new HttpException(
        `Somente administradores podem editar projetos de outros usuários`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.projectsRepository.update(id, {
      ...projectUpdateData,
      updatedAt: new Date(),
    });

    return await this.projectsRepository.findOne({
      where: {
        id,
      },
    });
  }

  async delete(id: string, userLogged: TokenPayloadDto): Promise<DeleteResult> {
    const { profileId, userId } = userLogged;

    const project = await this.projectsRepository.findOne({
      where: {
        id,
      },
    });

    if (profileId !== 1 && project.userId !== userId) {
      throw new HttpException(
        `Somente administradores podem remover projectos de outros usuários`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return await this.projectsRepository.delete(id);
  }
}
