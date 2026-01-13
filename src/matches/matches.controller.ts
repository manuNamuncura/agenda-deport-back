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
import { Public } from '../auth/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('matches')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo partido' })
  @ApiResponse({ status: 201, description: 'Partido creado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(@CurrentUser() user: any, @Body() createMatchDto: CreateMatchDto) {
    return this.matchesService.create(user.id, createMatchDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los partidos del usuario' })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiQuery({ name: 'courtType', required: false, enum: ['FIVE', 'SEVEN', 'ELEVEN', 'OTHER'] })
  @ApiQuery({ name: 'category', required: false, enum: ['FRIENDS', 'FRIENDLY', 'TOURNAMENT'] })
  @ApiQuery({ name: 'result', required: false, enum: ['WON', 'LOST', 'TIED'] })
  @ApiResponse({ status: 200, description: 'Lista de partidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
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
  @ApiOperation({ summary: 'Obtener partidos recientes' })
  @ApiResponse({ status: 200, description: 'Partidos recientes' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  getRecent(@CurrentUser() user: any) {
    return this.matchesService.getRecentMatches(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un partido por ID' })
  @ApiResponse({ status: 200, description: 'Partido encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Partido no encontrado' })
  findOne(@CurrentUser() user: any, @Param('id', ParseUUIDPipe) id: string) {
    return this.matchesService.findOne(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un partido' })
  @ApiResponse({ status: 200, description: 'Partido actualizado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Partido no encontrado' })
  update(
    @CurrentUser() user: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMatchDto: UpdateMatchDto,
  ) {
    return this.matchesService.update(user.id, id, updateMatchDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un partido' })
  @ApiResponse({ status: 200, description: 'Partido eliminado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Partido no encontrado' })
  remove(@CurrentUser() user: any, @Param('id', ParseUUIDPipe) id: string) {
    return this.matchesService.remove(user.id, id);
  }
}