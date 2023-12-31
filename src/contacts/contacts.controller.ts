import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { UserLogged } from 'src/decorators/userLogged';
import TokenPayloadDto from 'src/auth/dtos/tokenPayload.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CreateContactDto } from './dtos/createContact.dto';
import { UpdateContactDto } from './dtos/updateContact.dto';

@UseGuards(AuthGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  async findAll(@UserLogged() userLogged: TokenPayloadDto) {
    return this.contactsService.findAll(userLogged);
  }

  @Post()
  async create(
    @Body() createContact: CreateContactDto,
    @UserLogged() userLogged: TokenPayloadDto,
  ) {
    return this.contactsService.create(createContact, userLogged);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateContact: UpdateContactDto,
    @UserLogged() userLogged: TokenPayloadDto,
  ) {
    return this.contactsService.update(id, updateContact, userLogged);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @UserLogged() userLogged: TokenPayloadDto) {
    return this.contactsService.delete(id, userLogged);
  }
}
