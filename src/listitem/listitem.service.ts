import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateListitemInput } from './dto/create-listitem.input';
import { UpdateListitemInput } from './dto/update-listitem.input';
import { Listitem } from './entities/listitem.entity';
import { ListsService } from '../lists/lists.service';
import { User } from '../users/entities/user.entity';
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

    return await this.listItemRepository.save( listItem );
  }

  findAll() {
    return `This action returns all listitem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} listitem`;
  }

  update(id: number, updateListitemInput: UpdateListitemInput) {
    return `This action updates a #${id} listitem`;
  }

  remove(id: number) {
    return `This action removes a #${id} listitem`;
  }
}
