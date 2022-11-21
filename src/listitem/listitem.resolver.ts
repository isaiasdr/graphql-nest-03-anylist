import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ListitemService } from './listitem.service';
import { Listitem } from './entities/listitem.entity';
import { CreateListitemInput } from './dto/create-listitem.input';
import { UpdateListitemInput } from './dto/update-listitem.input';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => Listitem)
@UseGuards( JwtAuthGuard )
export class ListitemResolver {
  constructor(private readonly listitemService: ListitemService) {}

  @Mutation(() => Listitem)
  async createListitem(
    @Args('createListitemInput') createListitemInput: CreateListitemInput,
    @CurrentUser() user: User
  ): Promise<Listitem> {
    return this.listitemService.create(createListitemInput, user);
  }

  /* @Query(() => [Listitem], { name: 'listitem' })
  findAll() {
    return this.listitemService.findAll();
  } */

  @Query(() => Listitem, { name: 'listitem' })
  async findOne(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string
  ): Promise<Listitem> {
    return this.listitemService.findOne(id);
  }

  @Mutation(() => Listitem)
  async updateListitem(
    @Args('updateListitemInput') updateListitemInput: UpdateListitemInput
  ): Promise<Listitem> {
    return this.listitemService.update(updateListitemInput.id, updateListitemInput);
  }

  /* @Mutation(() => Listitem)
  removeListitem(@Args('id', { type: () => Int }) id: number) {
    return this.listitemService.remove(id);
  } */
}
