import {Length } from "class-validator";

export class UserDto {


    @Length(3, 20, { message: 'Username has to be at between 3 and 20 chars' })
    public username: string

}