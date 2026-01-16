// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get('JWT_SECRET');
        const expiresIn = configService.get('JWT_EXPIRATION') || '7d';
        
        console.log('JWT Configuration:');
        console.log('- Secret exists:', !!secret);
        console.log('- Expires in:', expiresIn);
        
        if (!secret) {
          throw new Error('JWT_SECRET must be defined in environment variables');
        }
        
        return {
          secret,
          signOptions: { expiresIn },
        } as any;
      },
      inject: [ConfigService],
    }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [
    AuthService,
    JwtModule,
    JwtAuthGuard,
    JwtStrategy,
  ],
})
export class AuthModule {}