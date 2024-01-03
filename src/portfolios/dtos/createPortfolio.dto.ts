import { IsString, IsOptional } from 'class-validator';

export class CreatePortfolioDto {
  @IsString()
  name: string;

  @IsOptional()
  apresentation: string;
}
