import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateListInput, UpdateListInput } from './dto/inputs';
import { User } from '../users/entities/user.entity';
import { List } from './entities/list.entity';
import { PaginationArgs, SearchArgs } from '../common/dto/args';
import { throws } from 'assert';

@Injectable()
export class ListsService {

  constructor (
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
  ) {}
  
  async create(createListInput: CreateListInput, user: User): Promise<List> {

    const newList = this.listRepository.create({ ...createListInput, user });
    
    return await this.listRepository.save( newList );
  }

  async findAll( user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs ) {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listRepository.createQueryBuilder()
      .take( limit )
      .skip( offset )
      .where(`"userId" = :userId`, { userId: user.id });

    if ( search )
      queryBuilder.andWhere(`Lower("name") like :search`, { search: `%${ search.toLowerCase() }%` });

    return await queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<List> {
    
    const list = await this.listRepository.findOneBy({ id, user: { id: user.id } });

    if ( !list ) throw new NotFoundException(`List with ${id} not found`);

    return list;
  }

  async update(id: string, updateListInput: UpdateListInput, user: User): Promise<List> {
    await this.findOne( id, user );
    const list = await this.listRepository.preload({ ...updateListInput, user });

    await this.listRepository.save( list );
    return list;
  }

  async remove(id: string, user: User): Promise<List> {
    const list = await this.findOne( id, user );
    await this.listRepository.remove( list );
    
    return { ...list, id };
  }

  async listsCountByUser( user: User ): Promise<number> {
    return this.listRepository.count({ 
      where: { 
        user: { 
          id: user.id 
        } 
      } 
    });
  }
}
