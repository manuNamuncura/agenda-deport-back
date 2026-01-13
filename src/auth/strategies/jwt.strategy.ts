import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
    
    this.logger.log('✅ JWT Strategy inicializada');
  }

  async validate(payload: any) {
    this.logger.log('=== JWT STRATEGY VALIDATE ===');
    this.logger.log(`Payload recibido: ${JSON.stringify(payload)}`);
    
    // Verificar que el payload tiene los campos necesarios
    if (!payload || !payload.sub) {
      this.logger.error('Payload inválido o sin "sub" field');
      throw new UnauthorizedException('Token inválido');
    }

    this.logger.log(`Buscando usuario en BD con ID: ${payload.sub}`);
    
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
          isActive: true,
        },
      });

      if (!user) {
        this.logger.error(`Usuario con ID ${payload.sub} no encontrado en BD`);
        throw new UnauthorizedException('Usuario no encontrado');
      }

      if (!user.isActive) {
        this.logger.error(`Usuario ${user.username} está inactivo`);
        throw new UnauthorizedException('Usuario inactivo');
      }

      this.logger.log(`✅ Usuario encontrado: ${user.username}`);
      
      // Retornar el usuario - IMPORTANTE: debe tener estructura consistente
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
      };
      
    } catch (error) {
      this.logger.error(`Error buscando usuario: ${error.message}`);
      throw new UnauthorizedException('Error de autenticación');
    }
  }
}