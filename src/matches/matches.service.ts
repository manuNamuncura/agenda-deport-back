import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { MatchResponseDto } from './dto/match-response.dto';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  private mapToDto(match: any): MatchResponseDto {
    return {
      id: match.id,
      date: match.date,
      courtType: match.courtType,
      category: match.category,
      result: match.result,
      goalsFor: match.goalsFor,
      goalsAgainst: match.goalsAgainst,
      performance: match.performance,
      notes: match.notes,
      placeId: match.placeId,
      placeName: match.placeName,
      latitude: match.latitude ?? null,
      longitude: match.longitude ?? null,
      address: match.address,
      city: match.city,
      country: match.country,
      createdAt: match.createdAt,
      updatedAt: match.updatedAt,
    };
  }

  async create(userId: string, createMatchDto: CreateMatchDto): Promise<MatchResponseDto> {
    const match = await this.prisma.match.create({
      data: {
        ...createMatchDto,
        userId,
      },
    });

    // Actualizar estadísticas del usuario
    await this.updateUserStats(userId);

    return this.mapToDto(match);
  }

  async findAll(
    userId: string,
    filters?: {
      startDate?: Date;
      endDate?: Date;
      courtType?: string;
      category?: string;
      result?: string;
    },
  ): Promise<MatchResponseDto[]> {
    const where: any = { userId };

    if (filters) {
      if (filters.startDate || filters.endDate) {
        where.date = {};
        if (filters.startDate) where.date.gte = filters.startDate;
        if (filters.endDate) where.date.lte = filters.endDate;
      }

      if (filters.courtType) where.courtType = filters.courtType;
      if (filters.category) where.category = filters.category;
      if (filters.result) where.result = filters.result;
    }

    const matches = await this.prisma.match.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return matches.map(this.mapToDto);
  }

  async findOne(userId: string, id: string): Promise<MatchResponseDto> {
    const match = await this.prisma.match.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!match) {
      throw new NotFoundException(`Partido con ID ${id} no encontrado`);
    }

    return this.mapToDto(match);
  }

  async update(
    userId: string,
    id: string,
    updateMatchDto: UpdateMatchDto,
  ): Promise<MatchResponseDto> {
    const match = await this.prisma.match.findFirst({
      where: { id, userId },
    });

    if (!match) {
      throw new NotFoundException(`Partido con ID ${id} no encontrado`);
    }

    const updatedMatch = await this.prisma.match.update({
      where: { id },
      data: updateMatchDto,
    });

    // Actualizar estadisiticas del usuario
    await this.updateUserStats(userId);

    return this.mapToDto(updatedMatch);
  }

  async remove(userId: string, id: string): Promise<void> {
    const match = await this.prisma.match.findFirst({
      where: { id, userId },
    });

    if (!match) {
      throw new NotFoundException(`Partido con ID ${id} no encontrado`);
    }

    await this.prisma.match.delete({
      where: { id },
    });
  }

  async getRecentMatches(userId: string, limit: number = 10): Promise<MatchResponseDto[]> {
    const matches = await this.prisma.match.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: limit,
    });

    return matches.map(this.mapToDto);
  }

  private async updateUserStats(userId: string): Promise<void> {
    const matches = await this.prisma.match.findMany({
      where: { userId },
    });

    if (matches.length === 0) return;

    const stats = {
      totalMatches: matches.length,
      totalWins: matches.filter(m => m.result === 'WON').length,
      totalLosses: matches.filter(m => m.result === 'LOST').length,
      totalTies: matches.filter(m => m.result === 'TIED').length,
      totalGoalsFor: matches.reduce((sum, m) => sum + m.goalsFor, 0),
      totalGoalsAgainst: matches.reduce((sum, m) => sum + m.goalsAgainst, 0),
      fiveMatches: matches.filter(m => m.courtType === 'FIVE').length,
      sevenMatches: matches.filter(m => m.courtType === 'SEVEN').length,
      elevenMatches: matches.filter(m => m.courtType === 'ELEVEN').length,
      otherMatches: matches.filter(m => m.courtType === 'OTHER').length,
      lastMatchDate: new Date(Math.max(...matches.map(m => m.date.getTime()))),
    };

    await this.prisma.userStats.upsert({
      where: { userId },
      update: stats,
      create: {
        userId,
        ...stats,
      },
    });
  }
}