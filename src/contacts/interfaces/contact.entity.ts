import { UserEntity } from 'src/users/interfaces/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('contacts')
export class ContactEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'created_at', nullable: false })
  createdAt: Date;

  @Column({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @Column({ default: true })
  status: boolean;

  @Column({ nullable: false })
  text: string;

  @Column({ name: 'contact_type_id', nullable: false })
  contactTypeId: number;

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.knowledges, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;
}
