import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserEntity } from './interfaces/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';

export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email } = createUserDto;

    const userExist = await this.userRepository.findBy({ email });
    if (userExist.length > 0) {
      throw new HttpException(
        `Já existe usuário com esse email cadastrado. Por favor, escolha outro email e tente novamente.`,
        HttpStatus.CONFLICT,
      );
    }

    const salt = await bcrypt.genSalt();
    const password = createUserDto.password;
    const passwordHashed = await bcrypt.hash(password, salt);

    const user = await this.userRepository.save({
      createdAt: new Date(),
      ...createUserDto,
      password: passwordHashed,
    });
    return { ...user, password: undefined };
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }
}
