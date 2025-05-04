import { ApiProperty } from "@nestjs/swagger";
import { RegisterUserDto } from "./register-user-dto";
import { IsNumber, IsOptional, IsString } from "class-validator";


export class EditUserDto extends RegisterUserDto{

}