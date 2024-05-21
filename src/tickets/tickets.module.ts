import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService, JwtStrategy],
})
export class TicketsModule {}
