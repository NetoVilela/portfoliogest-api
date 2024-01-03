import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  name: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  password: string;

  @IsBoolean()
  status: boolean;
}
