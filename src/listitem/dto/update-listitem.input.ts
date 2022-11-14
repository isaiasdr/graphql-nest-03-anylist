import { CreateListitemInput } from './create-listitem.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateListitemInput extends PartialType(CreateListitemInput) {
  @Field(() => Int)
  id: number;
}
