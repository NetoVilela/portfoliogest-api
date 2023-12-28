import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user?.password !== pass) {
      throw new HttpException(
        `Credenciais inválidas.`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { sub: user.id, name: user.name, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
