import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SEED_ITEMS, SEED_USERS, SEED_LISTS } from './data/seed-data';
import { Item } from '../items/entities/item.entity';
import { User } from '../users/entities/user.entity';
import { Listitem } from '../listitem/entities/listitem.entity';
import { List } from '../lists/entities/list.entity';

import { UsersService } from '../users/users.service';
import { ItemsService } from '../items/items.service';
import { ListitemService } from '../listitem/listitem.service';
import { ListsService } from '../lists/lists.service';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,

        @InjectRepository( Item )
        private readonly itemRepository: Repository<Item>,
        private readonly itemService: ItemsService,

        @InjectRepository( User )
        private readonly userRepository: Repository<User>,
        private readonly userService: UsersService,

        @InjectRepository(Listitem)
        private readonly listItemRepository: Repository<Listitem>,
        private readonly listItemService: ListitemService,

        @InjectRepository(List)
        private readonly listRepository: Repository<List>,
        private readonly listService: ListsService,
    ) {
        this.isProd = this.configService.get('STATE') === 'prod'
    }

    async executeSeed() {
        if (this.isProd) throw new UnauthorizedException('We cannot run the seed in prod');
        
        /* Clear DB */
        await this.deleteDatabase();

        /* Create Users */
        const users = await this.loadUsers();

        /* Create Items */
        await this.loadItems( users );

        /* Create Lists */
        const lists = await this.loadLists( users );

        /* Create ListItems */
        const items = await this.itemService.findAll( users[0], { limit: 15, offset: 0 }, {});
        await this.loadListItems(lists[0], items);
        
        return true;
    }

    async deleteDatabase() {

        /* Remove ListItems */
        await this.listItemRepository.createQueryBuilder().delete().execute();

        /* Remove List */
        await this.listRepository.createQueryBuilder().delete().execute();

        /* Remove items */
        await this.itemRepository.createQueryBuilder().delete().execute();

        /* Remove users */
        await this.userRepository.createQueryBuilder().delete().execute();        
    }

    async loadUsers(): Promise<User[]> {

        const users = [];

        for (const user of SEED_USERS)
            users.push( await this.userService.create( user ) );

        return users;
    }

    async loadItems( users: User[] ): Promise<void> {

        const itemsPromises = [];

        for (const item of SEED_ITEMS) {

            const randomIndex = Math.floor( Math.random() * users.length );
            const user = users[ randomIndex ];

            itemsPromises.push( this.itemService.create( item, user ) );
        }

        Promise.all( itemsPromises );
    }

    async loadLists( users: User[] ): Promise<List[]> {
        const lists = [];

        for (const list of SEED_LISTS) {
            const randomIndex = Math.floor( Math.random() * users.length );
            lists.push( await this.listService.create( list, users[randomIndex] ) );
        }

        return lists;
    }

    async loadListItems( list: List, items: Item[] ): Promise<void> {
        const listItems = [];

        for (const item of items) {
            
            await this.listItemService.create({ 
                completed: Math.round( Math.random() * 1 ) === 0, 
                itemId: item.id, 
                listId: list.id, 
                quantity: Math.round( Math.random() * 10 ),
            }, list.user)
        }
    }
}
