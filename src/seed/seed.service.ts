import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Item } from '../items/entities/item.entity';
import { User } from '../users/entities/user.entity';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { UsersService } from '../users/users.service';
import { ItemsService } from '../items/items.service';

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

        return true;
    }

    async deleteDatabase() {
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
}
