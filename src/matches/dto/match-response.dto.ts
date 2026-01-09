import { CourtType, Category, Result, PerformanceRating } from '@prisma/client';

export class MatchResponseDto {
  id: string;
  date: Date;
  courtType: CourtType;
  category: Category;
  result: Result;
  goalsFor: number;
  goalsAgainst: number;
  performance: PerformanceRating;
  notes?: string;
  placeId: string;
  placeName: string;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
  updatedAt: Date;
}