import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { TicketDto } from './dto/ticket.dto';
import { TicketUpdateDto } from './dto/ticketUpdate.dto';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async createTicket(dto: TicketDto, req: Request) {
    const { title, description } = dto;
    const decodedUser = req.user as { id: string; email: string };

    await this.prisma.ticket.create({
      data: {
        title,
        description,
        user: { connect: { id: decodedUser.id } },
      },
    });

    return { message: 'Création du ticket avec succés' };
  }
  async getTickets(req: Request) {
    const decodedUser = req.user as { id: string; email: string };

    const tickets = await this.prisma.ticket.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        response: true,
      },
      where: { userId: decodedUser.id },
    });

    return tickets;
  }

  async getAllTickets(req: Request) {
    const checkRole = req.user as { role: string };
    if (checkRole.role !== 'ADMIN') {
      throw new ForbiddenException();
    }
    const allTickets = await this.prisma.ticket.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        response: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    return allTickets;
  }

  async updateTicket(dto: TicketUpdateDto, id: string, req: Request) {
    const { response } = dto;
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });

    if (!ticket) {
      throw new NotFoundException();
    }

    await this.prisma.ticket.update({
      where: {
        id,
      },
      data: {
        response,
        status: 'DONE',
      },
    });

    return { message: 'response was succesfull' };
  }

  async deleteTicket(id: string, req: Request) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });

    const decodedUser = req.user as { id: string };

    if (!ticket) {
      throw new ForbiddenException();
    }

    if (ticket.userId !== decodedUser.id) {
      throw new ForbiddenException();
    }

    await this.prisma.ticket.delete({ where: { id } });

    return 'Suppression du ticket avec succés';
  }
}
