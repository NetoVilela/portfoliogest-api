import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const UserLogged = createParamDecorator((_, ctx: ExecutionContext) => {
  const authorization = ctx.switchToHttp().getRequest().headers.authorization;
  const token = authorization.replace('Bearer ', '');

  return jwt.verify(token, process.env.JWT_SECRET);
});
