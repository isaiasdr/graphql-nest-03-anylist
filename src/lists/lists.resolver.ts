import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';

import { ListsService } from './lists.service';
import { List } from './entities/list.entity';
import { CreateListInput, UpdateListInput } from './dto/inputs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { PaginationArgs, SearchArgs } from '../common/dto/args';
import { Listitem } from 'src/listitem/entities/listitem.entity';
import { ListitemService } from '../listitem/listitem.service';

@Resolver(() => List)
@UseGuards( JwtAuthGuard )
export class ListsResolver {
  constructor(
    private readonly listsService: ListsService,
    private readonly listItemService: ListitemService,
  ) {}

  @Mutation(() => List, { name: 'createList' })
  async createList(
    @Args('createListInput') createListInput: CreateListInput,
    @CurrentUser() user: User
  ): Promise<List> {
    return this.listsService.create(createListInput, user);
  }

  @Query(() => [List], { name: 'lists' })
  async findAll(
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ) {
    return this.listsService.findAll( user, paginationArgs, searchArgs );
  }

  @Query(() => List, { name: 'list' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.listsService.findOne(id, user);
  }

  @Mutation(() => List)
  updateList(
    @Args('updateListInput') updateListInput: UpdateListInput,
    @CurrentUser() user: User,
  ): Promise<List> {
    return this.listsService.update(updateListInput.id, updateListInput, user);
  }

  @Mutation(() => List)
  removeList(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User
  ): Promise<List> {
    return this.listsService.remove(id, user);
  }

  @ResolveField( () => [Listitem], { name: 'items' } )
  getListItems(
    @Parent() list: List,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<Listitem[]> {
    return this.listItemService.findAll( list, paginationArgs, searchArgs );
  }

  @ResolveField( () => Number, { name: 'totalItems' } )
  countListItemsByList(
    @Parent() list: List,
  ): Promise<number> {

    return this.listItemService.countListItemsByList( list );
  }
}
