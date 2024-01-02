import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const updateUserSchema = z
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

export class UpdateUserDto extends createZodDto(updateUserSchema) {}
