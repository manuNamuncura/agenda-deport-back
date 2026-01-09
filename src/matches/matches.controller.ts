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
  Request,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('matches')
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo partido' })
  @ApiResponse({ status: 201, description: 'Partido creado exitosamente' })
  create(@Request() req, @Body() createMatchDto: CreateMatchDto) {
    // TODO: Implementar autenticación
    const userId = 'demo-user-id'; // Temporal - reemplazar con auth real
    return this.matchesService.create(userId, createMatchDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los partidos del usuario' })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiQuery({ name: 'courtType', required: false, enum: ['FIVE', 'SEVEN', 'ELEVEN', 'OTHER'] })
  @ApiQuery({ name: 'category', required: false, enum: ['FRIENDS', 'FRIENDLY', 'TOURNAMENT'] })
  @ApiQuery({ name: 'result', required: false, enum: ['WON', 'LOST', 'TIED'] })
  findAll(
    @Request() req,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
    @Query('courtType') courtType?: string,
    @Query('category') category?: string,
    @Query('result') result?: string,
  ) {
    const userId = 'demo-user-id';
    const filters = { startDate, endDate, courtType, category, result };
    return this.matchesService.findAll(userId, filters);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Obtener partidos recientes' })
  getRecent(@Request() req) {
    const userId = 'demo-user-id';
    return this.matchesService.getRecentMatches(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un partido por ID' })
  findOne(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    const userId = 'demo-user-id';
    return this.matchesService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un partido' })
  update(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMatchDto: UpdateMatchDto,
  ) {
    const userId = 'demo-user-id';
    return this.matchesService.update(userId, id, updateMatchDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un partido' })
  remove(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    const userId = 'demo-user-id';
    return this.matchesService.remove(userId, id);
  }
}