import { IsString } from 'class-validator';

export class CreateAvatarDto {
  @IsString({ message: 'Necessário informar o userId.' })
  userId: string;
}
