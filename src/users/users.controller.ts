import { UsersService } from './users.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Post()
  async createUser(@Body() createUser: CreateUserDto) {
    return this.usersService.createUser(createUser);
  }
}
