import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactEntity } from './interfaces/contact.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([ContactEntity]), JwtModule],
  controllers: [ContactsController],
  providers: [ContactsService],
})
export class ContactsModule {}
