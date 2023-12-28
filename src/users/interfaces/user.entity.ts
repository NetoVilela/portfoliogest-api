import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;
}
