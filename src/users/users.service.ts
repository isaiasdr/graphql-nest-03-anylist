import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { SignupInput } from '../auth/dto/inputs/signup.input';
import { UpdateUserInput } from './dto/inputs';
import { User } from './entities/user.entity';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { PaginationArgs, SearchArgs } from '../common/dto/args';


@Injectable()
export class UsersService {

  private logger: Logger = new Logger('UsersService');

  constructor (
    @InjectRepository( User )
    private readonly usersRepository: Repository<User>,
  ) {}

  async create( signupInput: SignupInput ): Promise<User> {
    try {
      const newUser = this.usersRepository.create({
        ...signupInput,
        password: bcrypt.hashSync( signupInput.password, 10 )
      });

      return await this.usersRepository.save( newUser );

    } catch (error) {
      this.handleDBErrors( error );
    }
  }

  async findAll( roles: ValidRoles[], paginationArgs: PaginationArgs, searchArgs: SearchArgs ): Promise<User[]> {

    const { limit, offset } = paginationArgs;
    const { search = '' } = searchArgs;

    const queryBuilder = this.usersRepository.createQueryBuilder()
      .take(limit)
      .skip(offset)
      
    if ( search )
      queryBuilder.andWhere(`LOWER("fullName") like :fullName`, { fullName: `%${search.toLowerCase()}%` })

    if ( roles.length === 0 ) return await queryBuilder.getMany();

    queryBuilder
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)

    return await queryBuilder.getMany();
  }

  async findOneByEmail(email: string): Promise<User> {

    try {
      return await this.usersRepository.findOneByOrFail({ email });
      
    } catch (error) {
      this.handleDBErrors({
        code: 'error-001',
        detail: `${ email } not found`
      });
    }
  }

  async findOneById(id: string): Promise<User> {

    try {
      return await this.usersRepository.findOneByOrFail({ id });
      
    } catch (error) {
      this.handleDBErrors({
        code: 'error-002',
        detail: `${ id } not found`
      });
    }
  }

  async update({ id, updateUserInput, updatedBy }: { id: string, updateUserInput: UpdateUserInput, updatedBy: User }): Promise<User> {

    try {
      const user = await this.usersRepository.preload({
        ...updateUserInput,
        id
      });
      user.lastUpdatedBy = updatedBy;

      return await this.usersRepository.save( user );


    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async block(id: string, user: User): Promise<User> {
    const userToBlock = await this.findOneById( id );

    userToBlock.isActive = false;
    userToBlock.lastUpdatedBy = user;

    await this.usersRepository.save( userToBlock );

    
    return userToBlock;
  }

  private handleDBErrors ( error: any ): never {
    
    if ( error.code = '23505' )
      throw new BadRequestException( error.detail.replace('Key ', '') );

    if ( error.code = 'error-001' )
      throw new BadRequestException( error.detail );

    this.logger.error(error);
    throw new InternalServerErrorException('Unhandled Error, check');
  }
}
