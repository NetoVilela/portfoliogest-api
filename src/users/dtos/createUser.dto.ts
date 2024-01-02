import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const createUserSchema = z
  .object({
    name: z.string({
      required_error: 'Obrigatório informar o nome do usuário',
    }),
    email: z
      .string({
        required_error: 'Obrigatório informar o email do usuário',
      })
      .email(),
    phone: z.string(),
    password: z.string({
      required_error: 'Obrigatório informar uma senha para o usuário',
    }),
  })
  .required();

export class CreateUserDto extends createZodDto(createUserSchema) {}
