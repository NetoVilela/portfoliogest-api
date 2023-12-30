import { KnowledgeEntity } from 'src/knowledges/interfaces/knowledge.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @Column({ default: true })
  status: boolean;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column({ name: 'profile_id', default: 2 })
  profileId: number;

  @OneToMany(() => KnowledgeEntity, (knowledge) => knowledge.user)
  knowledges: KnowledgeEntity[];
}
