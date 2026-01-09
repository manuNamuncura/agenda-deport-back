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
      latitude: match.latitude,
      longitude: match.longitude,
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
}