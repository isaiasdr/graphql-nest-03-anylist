import { forwardRef, Module } from '@nestjs/common';
import { ListitemService } from './listitem.service';
import { ListitemResolver } from './listitem.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listitem } from './entities/listitem.entity';
import { ItemsModule } from '../items/items.module';
import { ListsModule } from '../lists/lists.module';

@Module({
  providers: [ListitemResolver, ListitemService],
  imports: [ TypeOrmModule.forFeature([ Listitem ]), forwardRef(() => ListsModule), ItemsModule, ],
  exports: [ListitemService, TypeOrmModule],
})
export class ListitemModule {}
