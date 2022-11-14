import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID, ResolveField, Int, Parent } from '@nestjs/graphql';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/inputs';
import { ValidRolesArgs } from './dto/args/roles.args';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { ItemsService } from '../items/items.service';
import { Item } from '../items/entities/item.entity';
import { PaginationArgs, SearchArgs } from '../common/dto/args';
import { ListsService } from '../lists/lists.service';
import { List } from '../lists/entities/list.entity';

@Resolver(() => User)
@UseGuards( JwtAuthGuard )
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemService: ItemsService,
    private readonly listService: ListsService,
  ) {}

  @Query(() => [User], { name: 'users' })
  async findAll(
    @Args() validRoles: ValidRolesArgs,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
    @CurrentUser([ ValidRoles.admin, ValidRoles.superUser ]) user: User
  ): Promise<User[]> {
    return this.usersService.findAll( validRoles.roles, paginationArgs, searchArgs );
  }

  @Query(() => User, { name: 'user' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ ValidRoles.admin, ValidRoles.superUser ]) user: User
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ ValidRoles.admin ]) user: User
  ) {
    return this.usersService.update({ id: updateUserInput.id, updateUserInput, updatedBy: user });
  }

  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser([ ValidRoles.admin ]) user: User
  ) {
    return this.usersService.block(id, user);
  }

  @ResolveField( () => Int, { name: 'itemCount' } )
  async itemCount(
    @CurrentUser([ ValidRoles.admin ]) adminUser: User,
    @Parent() user: User
  ): Promise<number> {
    return this.itemService.itemCountByUser(user);
  }

  @ResolveField( () => [Item], { name: 'items' } )
  async getItemsByUser(
    @CurrentUser([ ValidRoles.admin ]) adminUser: User,
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<Item[]> {
    return this.itemService.findAll(user, paginationArgs, searchArgs);
  }

  @ResolveField( () => Int, { name: 'listCount' } )
  async ListCount(
    @CurrentUser([ ValidRoles.admin ]) adminUser: User,
    @Parent() user: User
  ): Promise<number> {
    return this.listService.listsCountByUser(user);
  }

  @ResolveField( () => [List], { name: 'lists' } )
  async getListsByUser(
    @CurrentUser([ ValidRoles.admin ]) adminUser: User,
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<List[]> {
    return this.listService.findAll(user, paginationArgs, searchArgs);
  }
}
