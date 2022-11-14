import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

@InputType()
export class SignupInput {

    @Field( () => String )
    @IsEmail()
    email: string;

    @Field( () => String )
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    fullName: string;

    @Field( () => String )
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}