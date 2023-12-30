import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserEntity } from './interfaces/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';
import TokenPayloadDto from 'src/auth/dtos/tokenPayload.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';

export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email } = createUserDto;

    const userExist = await this.usersRepository.findBy({ email });
    if (userExist.length > 0) {
      throw new HttpException(
        `Já existe usuário com esse email cadastrado. Por favor, escolha outro email e tente novamente.`,
        HttpStatus.CONFLICT,
      );
    }

    const salt = await bcrypt.genSalt();
    const password = createUserDto.password;
    const passwordHashed = await bcrypt.hash(password, salt);

    const user = await this.usersRepository.save({
      ...createUserDto,
      createdAt: new Date(),
      password: passwordHashed,
    });
    return { ...user, password: undefined };
  }

  async findAll() {
    return this.usersRepository.find({
      select: [
        'id',
        'name',
        'email',
        'createdAt',
        'updatedAt',
        'phone',
        'status',
      ],
    });
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return await this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  async delete(id: number, userLogged: TokenPayloadDto): Promise<DeleteResult> {
    const { profileId } = userLogged;
    if (profileId === 1) {
      // ADMIN
      return await this.usersRepository.delete(id);
    } else {
      throw new HttpException(
        `Somente Administradores podem remover outros usuários`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async update(
    id: string,
    userUpdateData: UpdateUserDto,
    userLogged: TokenPayloadDto,
  ) {
    const { userId, profileId } = userLogged;
    const { name, email, phone, password } = userUpdateData;

    if (profileId !== 1 && userId !== id) {
      throw new HttpException(
        `Somente Administradores podem editar outros usuários`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
    });

    if (user.profileId === 1 && user.id !== userId) {
      throw new HttpException(
        `Administradores não podem editar outros administradores`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    const passwordHashed = !passwordMatch
      ? await bcrypt.hash(password, await bcrypt.genSalt())
      : undefined;

    await this.usersRepository.update(id, {
      name,
      email,
      phone,
      password: passwordHashed,
    });
  }
}
