import { UserEntity } from 'src/users/interfaces/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('projects')
export class ProjectEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'created_at', nullable: false })
  createdAt: Date;

  @Column({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @Column({ default: true })
  status: boolean;

  @Column({ nullable: false })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  finished: boolean;

  @Column()
  link: string;

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.projects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;
}
