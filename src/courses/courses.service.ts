import { InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from './interfaces/courses.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateCourseDto } from './dtos/createCourse.dto';
import TokenPayloadDto from 'src/auth/dtos/tokenPayload.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateCourseDto } from './dtos/updateCourse.dto';

export class CoursesService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly coursesRepository: Repository<CourseEntity>,
  ) {}

  async findAll(userLogged: TokenPayloadDto) {
    const { profileId, userId } = userLogged;

    if (profileId === 1) {
      return await this.coursesRepository
        .createQueryBuilder('c')
        .innerJoinAndSelect('c.user', 'user')
        .select([
          'c.id',
          'c.createdAt',
          'c.updatedAt',
          'c.status',
          'c.name',
          'c.institution',
          'c.institutionAcronym',
          'c.degreeId',
          'c.situationId',
          'c.monthStart',
          'c.yearStart',
          'c.monthEnd',
          'c.yearEnd',
          'user.id',
          'user.name',
        ])
        .getMany();
    } else {
      return await this.coursesRepository
        .createQueryBuilder('c')
        .innerJoinAndSelect('c.user', 'user')
        .select([
          'c.id',
          'c.createdAt',
          'c.updatedAt',
          'c.status',
          'c.name',
          'c.institution',
          'c.institutionAcronym',
          'c.degreeId',
          'c.situationId',
          'c.monthStart',
          'c.yearStart',
          'c.monthEnd',
          'c.yearEnd',
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

  async create(createCourse: CreateCourseDto, userLogged: TokenPayloadDto) {
    const { userId } = userLogged;
    const { name, institution } = createCourse;

    const exprienceExist = await this.coursesRepository
      .createQueryBuilder('p')
      .where('p.user.id = :userId AND p.name = :name', {
        userId,
        name,
        institution,
      })
      .getMany();

    if (exprienceExist.length > 0) {
      throw new HttpException(
        `Já existe esse curso nessa instituição cadastrado em sua conta.`,
        HttpStatus.CONFLICT,
      );
    }

    const newCourse = this.coursesRepository.create({
      ...createCourse,
      createdAt: new Date(),
      user: { id: userId },
    });

    await this.coursesRepository.save(newCourse);

    return {
      ...newCourse,
      userId: undefined,
    };
  }

  async update(
    id: string,
    courseUpdateDto: UpdateCourseDto,
    userLogged: TokenPayloadDto,
  ) {
    const { userId, profileId } = userLogged;

    const course = await this.coursesRepository.findOne({
      where: {
        id,
      },
    });

    if (profileId !== 1 && course.userId !== userId) {
      throw new HttpException(
        `Somente administradores podem editar Cursos de outros usuários`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.coursesRepository.update(id, {
      ...courseUpdateDto,
      updatedAt: new Date(),
    });

    return await this.coursesRepository.findOne({
      where: {
        id,
      },
    });
  }

  async delete(id: string, userLogged: TokenPayloadDto): Promise<DeleteResult> {
    const { profileId, userId } = userLogged;

    const course = await this.coursesRepository.findOne({
      where: {
        id,
      },
    });

    if (profileId !== 1 && course.userId !== userId) {
      throw new HttpException(
        `Somente administradores podem remover Cursos de outros usuários`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return await this.coursesRepository.delete(id);
  }
}
