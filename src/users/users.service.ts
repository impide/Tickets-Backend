import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMyUser(id: string, req: Request) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, username: true },
    });

    if (!user) {
      throw new NotFoundException();
    }
    const decodedUser = req.user as { id: string; email: string };

    if (user.id !== decodedUser.id) {
      throw new ForbiddenException();
    }

    return { user };
  }

  async getUsers() {
    return await this.prisma.user.findMany({
      select: { id: true, email: true },
    });
  }

  async deleteUser(id: string, req: Request) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    const decodedUser = req.user as { id: string; email: string };
    if (!user) {
      throw new NotFoundException();
    }

    if (user.id !== decodedUser.id) {
      throw new ForbiddenException();
    }

    await this.prisma.user.delete({ where: { id } });

    return 'succes';
  }

  async updateUser(dto: UserDto, id: string, req: Request) {
    const { username } = dto;
    const user = await this.prisma.user.findUnique({ where: { id } });
    const decodedUser = req.user as { id: string; email: string };
    if (!user) {
      throw new NotFoundException();
    }

    if (user.id !== decodedUser.id) {
      throw new ForbiddenException();
    }

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        username,
      },
    });

    return { message: 'update was succesfull' };
  }
}
