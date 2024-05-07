import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { TicketDto } from './dto/ticket.dto';
import { TicketUpdateDto } from './dto/ticketUpdate.dto';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('createTicket')
  createTicket(@Body() dto: TicketDto, @Req() req) {
    return this.ticketsService.createTicket(dto, req);
  }

  @Get('/')
  getTickets(@Req() req) {
    return this.ticketsService.getTickets(req);
  }
  @Get('allTickets')
  getAllTickets(@Req() req) {
    return this.ticketsService.getAllTickets(req);
  }
  @Put(':id')
  updatePost(
    @Body() dto: TicketUpdateDto,
    @Param() params: { id: string },
    @Req() req,
  ) {
    return this.ticketsService.updateTicket(dto, params.id, req);
  }

  @Delete(':id')
  ddeleteTicket(@Param() params: { id: string }, @Req() req) {
    return this.ticketsService.deleteTicket(params.id, req);
  }
}
