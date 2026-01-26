import { ApiProperty } from "@nestjs/swagger";

export class AuthResponseDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...', description: 'JWT token' })
    accessToken: string;

    @ApiProperty({
        example: {
            id: 'clp1a2b3c4d5e',
            username: 'jugador1',
            email: 'jugador@email.com',
            name: 'Juan Pérez' 
        },
        description: 'Datos del usuario'
    })
    user: {
        id: string;
        username: string;
        email?: string;
        name?: string;
    };

    @ApiProperty({ example: '7d', description: 'Tiempo de expiración' })
    expiresIn: string;
}