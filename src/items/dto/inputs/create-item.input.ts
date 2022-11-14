import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateItemInput {
  
  @Field( () => String )
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field( () => String, { nullable: true } )
  @IsOptional()
  quantityUnits?: string;
}
