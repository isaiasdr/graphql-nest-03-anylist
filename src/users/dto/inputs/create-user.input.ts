import { InputType,  Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field( () => String )
  @IsEmail()
  email: string;

  @Field( () => String )
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  fullName: string;
}
