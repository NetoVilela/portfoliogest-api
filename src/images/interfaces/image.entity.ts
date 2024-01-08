import { UserEntity } from 'src/users/interfaces/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('images')
export class ImageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'created_at', nullable: false })
  createdAt: Date;

  @Column({ name: 'original_file_name', nullable: false })
  originalFileName: string;

  @Column({ name: 'file_name', nullable: false })
  fileName: string;

  @Column({ name: 'size', nullable: false })
  size: number;

  @Column({ name: 'content_type', nullable: false })
  contentType: string;

  @Column({ name: 'file_path', nullable: false })
  filePath: string;

  @OneToOne(() => UserEntity, (user) => user.image)
  user: UserEntity;
}
