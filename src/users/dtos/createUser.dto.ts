import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Min(3)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  phone: string;

  @IsNotEmpty()
  password: string;
}
