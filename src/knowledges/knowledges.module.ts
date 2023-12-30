import { Module } from '@nestjs/common';
import { KnowledgesController } from './knowledges.controller';
import { KnowledgesService } from './knowledges.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KnowledgeEntity } from './interfaces/knowledge.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([KnowledgeEntity]), JwtModule],
  controllers: [KnowledgesController],
  providers: [KnowledgesService],
})
export class KnowledgesModule {}
