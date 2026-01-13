import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class SignUpDto {
    @ApiProperty({ example: 'jugador1', description: 'Nombre de usuario único' })
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    username: string;

    @ApiProperty({ example: 'jugador@email.com', description: 'Correo electrónico' })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo' })
    @IsString()
    @IsOptional()
    @MaxLength(150)
    name?: string; 

    @ApiProperty({ example: 'password123', description: 'Contraseña' })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}