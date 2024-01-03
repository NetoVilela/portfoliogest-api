import { UserEntity } from 'src/users/interfaces/user.entity';
import { PortfolioEntity } from '../interfaces/portfolio.entity';

export class ReturnPortfolioDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: boolean;
  name: string;
  apresentation: string;
  user: UserEntity;

  constructor(portfolioEntity: PortfolioEntity) {
    console.log(portfolioEntity);
    this.id = portfolioEntity.id;
    this.createdAt = portfolioEntity.createdAt;
    this.updatedAt = portfolioEntity.updatedAt;
    this.status = portfolioEntity.status;
    this.name = portfolioEntity.name;
    this.apresentation = portfolioEntity.apresentation;
    this.user = portfolioEntity.user;
  }
}
