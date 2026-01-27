// src/matches/matches.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createMatchDto: CreateMatchDto) {
    return this.matchesService.create(user.id, createMatchDto);
  }

  @Get()
  findAll(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
    @Query('courtType') courtType?: string,
    @Query('category') category?: string,
    @Query('result') result?: string,
  ) {
    const filters = { startDate, endDate, courtType, category, result };
    return this.matchesService.findAll(user.id, filters);
  }

  @Get('recent')
  getRecent(@CurrentUser() user: any) {
    return this.matchesService.getRecentMatches(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id', ParseUUIDPipe) id: string) {
    return this.matchesService.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateMatchDto: UpdateMatchDto,
  ) {
    return this.matchesService.update(user.id, id, updateMatchDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.matchesService.remove(user.id, id);
  }
}