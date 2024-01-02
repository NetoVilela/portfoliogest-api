import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const UserLogged = createParamDecorator((_, ctx: ExecutionContext) => {
  const authorization = ctx.switchToHttp().getRequest().headers.authorization;
  const token = authorization.replace('Bearer ', '');

  if (!process.env.JWT_SECRET) {
    throw new Error('A chave JWT_SECRET não está definida.');
  }

  return jwt.verify(token, process.env.JWT_SECRET);
});
