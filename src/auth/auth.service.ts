import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS!) || 10;
    return bcrypt.hash(password, saltRounds);
  }

  private async comparePasswords(plainText: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashed);
  }

  async signUp(signUpDto: SignUpDto): Promise<AuthResponseDto> {
    // Verificar si el username ya existe
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: signUpDto.username },
          ...(signUpDto.email ? [{ email: signUpDto.email }] : []),
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('El nombre de usuario o email ya está en uso');
    }

    // Hashear contraseña
    const hashedPassword = await this.hashPassword(signUpDto.password);

    // Crear usuario
    const user = await this.prisma.user.create({
      data: {
        username: signUpDto.username,
        email: signUpDto.email,
        name: signUpDto.name,
        password: hashedPassword,
      },
    });

    // Crear estadísticas iniciales para el usuario
    await this.prisma.userStats.create({
      data: {
        userId: user.id,
      },
    });

    // Generar token
    const token = this.generateToken(user);

    return {
      accessToken: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email || undefined,
        name: user.name || undefined,
      },
      expiresIn: process.env.JWT_EXPIRATION || '7d',
    };
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponseDto> {
    // Buscar usuario por username o email
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: signInDto.identifier },
          { email: signInDto.identifier },
        ],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // Verificar contraseña
    const isValidPassword = await this.comparePasswords(
      signInDto.password,
      user.password!,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar token
    const token = this.generateToken(user);

    return {
      accessToken: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email || undefined,
        name: user.name || undefined,
      },
      expiresIn: process.env.JWT_EXPIRATION || '7d',
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return user;
  }

  async updateProfile(userId: string, updateData: { name?: string; email?: string }) {
    // Verificar si el email ya está en uso por otro usuario
    if (updateData.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email: updateData.email,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        throw new ConflictException('El email ya está en uso');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const isValidPassword = await this.comparePasswords(oldPassword, user.password!);

    if (!isValidPassword) {
      throw new BadRequestException('Contraseña actual incorrecta');
    }

    // Hashear nueva contraseña
    const hashedPassword = await this.hashPassword(newPassword);

    // Actualizar contraseña
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Contraseña actualizada exitosamente' };
  }

  async validateToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

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

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Usuario no válido');
      }

      return { valid: true, user };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  private generateToken(user: any): string {
    const payload = {
      sub: user.id,
      username: user.username,
    };

    const expiresIn = process.env.JWT_EXPIRATION || '7d';

    return this.jwtService.sign(payload, {
      expiresIn: expiresIn as any,
    });
  }
}