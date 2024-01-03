import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdatePortfolioDto {
  @IsString()
  name: string;

  @IsOptional()
  apresentation: string;

  @IsBoolean()
  status: boolean;
}
