import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min, Max, IsNumber, isNumber } from 'class-validator';
import { CourtType, Category, Result, PerformanceRating } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateMatchDto {
  @IsNotEmpty()
  @Type(() => Date)
  date: Date;

  @IsEnum(CourtType)
  courtType: CourtType;

  @IsEnum(Category)
  category: Category;

  @IsEnum(Result)
  result: Result;

  @IsInt()
  @Min(0)
  goalsFor: number;

  @IsInt()
  @Min(0)
  goalsAgainst: number;

  @IsEnum(PerformanceRating)
  performance: PerformanceRating;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNotEmpty()
  @IsString()
  placeId: string;

  @IsNotEmpty()
  @IsString()
  placeName: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}