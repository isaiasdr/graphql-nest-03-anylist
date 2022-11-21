import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

import { CreateListitemInput } from './create-listitem.input';

@InputType()
export class UpdateListitemInput extends PartialType(CreateListitemInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
