import { UserEntity } from 'src/users/interfaces/user.entity';
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('courses')
export class CourseEntity {
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

  @Column({ nullable: false })
  institution: string;

  @Column({ name: 'institution_acronym' })
  institutionAcronym: string;

  @Column({ name: 'degree_id' })
  degreeId: number;

  @Column({ name: 'situation_id' })
  situationId: number;

  @Column({ name: 'month_start' })
  @Check(`"month_start" >= 1 AND "month_start" <= 12`)
  monthStart: number;

  @Column({ name: 'year_start' })
  @Check(`"year_start" >= 1`)
  yearStart: number;

  @Column({ name: 'month_end', nullable: true })
  @Check(`"month_end" >= 1 AND "month_end" <= 12`)
  monthEnd: number;

  @Column({ name: 'year_end', nullable: true })
  @Check(`"year_end" >= 1`)
  yearEnd: number;

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.experiences, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;
}
