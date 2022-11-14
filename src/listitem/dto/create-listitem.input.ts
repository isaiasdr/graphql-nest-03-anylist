import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

@InputType()
export class CreateListitemInput {
  
  @Field( () => Number, { nullable: true } )
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity: number = 0;

  @Field( () => Boolean, { nullable: true } )
  @IsBoolean()
  @IsOptional()
  completed: boolean = false;

  @Field( () => ID )
  @IsUUID()
  listId: string;

  @Field( () => ID )
  @IsUUID()
  itemId: string;
}
