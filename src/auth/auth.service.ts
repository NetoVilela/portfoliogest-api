import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import getProfile from 'src/constants/profiles';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new HttpException(
        `Credenciais inválidas.`,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
      throw new HttpException(
        `Credenciais inválidas.`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = {
      userId: user.id,
      name: user.name,
      email: user.email,
      profileId: user.profileId,
      profileName: getProfile(user.profileId),
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
