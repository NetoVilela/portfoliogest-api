import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactEntity } from './interfaces/contact.entity';
import { DeleteResult, Repository } from 'typeorm';
import TokenPayloadDto from 'src/auth/dtos/tokenPayload.dto';
import { CreateContactDto } from './dtos/createContact.dto';
import { UpdateContactDto } from './dtos/updateContact.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(ContactEntity)
    private readonly contactRepository: Repository<ContactEntity>,
  ) {}

  async findAll(userLogged: TokenPayloadDto) {
    const { userId, profileId } = userLogged;

    if (profileId === 1) {
      return await this.contactRepository
        .createQueryBuilder('c')
        .innerJoinAndSelect('c.user', 'user')
        .select([
          'c.id',
          'c.createdAt',
          'c.updatedAt',
          'c.status',
          'c.text',
          'c.contactTypeId',
          'user.id',
          'user.name',
        ])
        .where({})
        .getMany();
    } else {
      return await this.contactRepository
        .createQueryBuilder('c')
        .innerJoinAndSelect('c.user', 'user')
        .select([
          'c.id',
          'c.createdAt',
          'c.updatedAt',
          'c.status',
          'c.text',
          'c.contactTypeId',
          'user.id',
          'user.name',
        ])
        .where({
          user: {
            id: userId,
          },
        })
        .getMany();
    }
  }

  async create(
    createContactDto: CreateContactDto,
    userLogged: TokenPayloadDto,
  ) {
    const { userId } = userLogged;
    const { text } = createContactDto;

    const contactExist = await this.contactRepository
      .createQueryBuilder('c')
      .where('c.user.id = :userId AND c.text = :text', {
        userId,
        text,
      })
      .getMany();

    if (contactExist.length > 0) {
      throw new HttpException(
        `Já existe um cadastro com essas informações de contato.`,
        HttpStatus.CONFLICT,
      );
    }

    const newContact = this.contactRepository.create({
      ...createContactDto,
      createdAt: new Date(),
      user: { id: userId },
    });

    await this.contactRepository.save(newContact);

    return {
      id: newContact.id,
      text: newContact.text,
      status: newContact.status,
    };
  }

  async update(
    id: string,
    contactUpdateData: UpdateContactDto,
    userLogged: TokenPayloadDto,
  ) {
    const { userId, profileId } = userLogged;

    const contact = await this.contactRepository.findOne({
      where: {
        id,
      },
    });

    if (!contact) {
      throw new HttpException(`Contato não encontrado`, HttpStatus.NOT_FOUND);
    }

    if (profileId !== 1 && contact.userId !== userId) {
      throw new HttpException(
        `Somente administradores podem editar Contatos de outros usuários`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.contactRepository.update(id, {
      ...contactUpdateData,
      updatedAt: new Date(),
    });

    return await this.contactRepository.findOne({
      where: {
        id,
      },
    });
  }

  async delete(id: string, userLogged: TokenPayloadDto): Promise<DeleteResult> {
    const { profileId, userId } = userLogged;

    const contact = await this.contactRepository.findOne({
      where: {
        id,
      },
    });

    if (!contact) {
      throw new HttpException(`Contato não encontrado`, HttpStatus.NOT_FOUND);
    }

    if (profileId !== 1 && contact.userId !== userId) {
      throw new HttpException(
        `Somente administradores podem remover Contatos de outros usuários`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return await this.contactRepository.delete(id);
  }
}
