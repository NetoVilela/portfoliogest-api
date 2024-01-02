import { UserEntity } from './../interfaces/user.entity';

export class ReturnUserDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: boolean;
  name: string;
  email: string;
  phone: string;
  profileId: number;

  constructor(userEntity: UserEntity) {
    this.id = userEntity.id;
    this.createdAt = userEntity.createdAt;
    this.updatedAt = userEntity.updatedAt;
    this.status = userEntity.status;
    this.name = userEntity.name;
    this.email = userEntity.email;
    this.phone = userEntity.phone;
    this.profileId = userEntity.profileId;
  }
}
