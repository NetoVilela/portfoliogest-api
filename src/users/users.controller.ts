import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserLogged } from 'src/decorators/userLogged';
import TokenPayloadDto from 'src/auth/dtos/tokenPayload.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { ReturnUserDto } from './dtos/returnUser.dto';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAllUsers(): Promise<ReturnUserDto[]> {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findById(@Param('id') id: string, @UserLogged() userLogged: TokenPayloadDto) {
    return this.usersService.findById(id, userLogged);
  }

  @Post()
  async createUser(@Body() createUser: CreateUserDto): Promise<ReturnUserDto> {
    return this.usersService.createUser(createUser);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() userUpdateData: UpdateUserDto,
    @UserLogged() userLogged: TokenPayloadDto,
  ): Promise<ReturnUserDto> {
    return this.usersService.update(id, userUpdateData, userLogged);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @UserLogged() userLogged: TokenPayloadDto) {
    return this.usersService.delete(id, userLogged);
  }
}
