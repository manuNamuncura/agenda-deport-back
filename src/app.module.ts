import { Module } from '@nestjs/common';
import { MatchesModule } from './matches/matches.module';
import { UsersModule } from './users/users.module';
import { StatsModule } from './stats/stats.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MatchesModule,
    UsersModule,
    StatsModule,
    PrismaModule,
    AuthModule
  ],
})
export class AppModule {}
