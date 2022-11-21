import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateListitemInput } from './dto/create-listitem.input';
import { UpdateListitemInput } from './dto/update-listitem.input';
import { PaginationArgs, SearchArgs } from '../common/dto/args';

import { Listitem } from './entities/listitem.entity';
import { User } from '../users/entities/user.entity';
import { List } from '../lists/entities/list.entity';

import { ListsService } from '../lists/lists.service';
import { ItemsService } from '../items/items.service';

@Injectable()
export class ListitemService {

  constructor(
    @InjectRepository(Listitem)
    private readonly listItemRepository: Repository<Listitem>,

    private readonly listService: ListsService,
    private readonly itemService: ItemsService,
  ) {}

  async create(createListitemInput: CreateListitemInput, user: User): Promise<Listitem> {
    const list = await this.listService.findOne( createListitemInput.listId, user );
    const item = await this.itemService.findOne( createListitemInput.itemId, user );

    const listItem = this.listItemRepository.create({ ...createListitemInput, list, item });

    await this.listItemRepository.save( listItem );

    return this.findOne( listItem.id );
  }

  async findAll( list: List, paginationArgs: PaginationArgs, searchArgs: SearchArgs ): Promise<Listitem[]> {
    
    const { limit, offset } = paginationArgs;
    const { search = '' } = searchArgs;

    const queryBuilder = this.listItemRepository.createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"listId" = :listId`, { listId: list.id })
      
    if ( search )
      queryBuilder.andWhere(`LOWER("name") like :name`, { name: `%${search.toLowerCase()}%` });

    return await queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Listitem> {
    
    const listItem = await this.listItemRepository.findOneBy({ id });
    if( !listItem ) throw new NotFoundException(`List item with ${id} not found`);
    
    return listItem;
  }

  async update(id: string, updateListitemInput: UpdateListitemInput): Promise<Listitem> {

    const { id: listItemId, itemId, listId, ...rest } = updateListitemInput;

    const queryBuilder = this.listItemRepository.createQueryBuilder()
      .update()
      .set(rest)
      .where('id = :id', { id });

    if ( listId ) queryBuilder.set({ list: { id: listId } });
    if ( itemId ) queryBuilder.set({ item: { id: itemId } });

    await queryBuilder.execute();

    return this.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} listitem`;
  }

  async countListItemsByList( list: List ): Promise<number> {
    return this.listItemRepository.count({ where: { list: { id: list.id } } });
  }
}
