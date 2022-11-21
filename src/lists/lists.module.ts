import { forwardRef, Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsResolver } from './lists.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { ListitemModule } from '../listitem/listitem.module';

@Module({
  providers: [ListsResolver, ListsService],
  imports: [ TypeOrmModule.forFeature([ List ]), forwardRef(() => ListitemModule) ],
  exports: [ ListsService, TypeOrmModule ],
})
export class ListsModule {}
