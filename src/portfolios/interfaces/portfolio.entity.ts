import { UserEntity } from 'src/users/interfaces/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('portfolios')
export class PortFolioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @Column({ default: true })
  status: boolean;

  @Column()
  name: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
