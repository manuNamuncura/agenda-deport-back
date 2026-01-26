import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SignInDto {
    @ApiProperty({ example: 'juagador1', description: 'Usuario o email' })
    @IsNotEmpty()
    @IsString()
    identifier: string; // Puede ser username o email

    @ApiProperty({ example: 'password123', description: 'Contraseña' })
    @IsNotEmpty()
    @IsString()
    password: string; 
}