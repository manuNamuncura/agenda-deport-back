import { Module } from '@nestjs/common';
import { MatchesModule } from './matches/matches.module';
import { UsersModule } from './users/users.module';
import { StatsModule } from './stats/stats.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MatchesModule, 
    UsersModule, 
    StatsModule, 
    PrismaModule
  ],
})
export class AppModule {}
