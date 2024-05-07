import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.serive';
import { AuthSigninDto, AuthSignupDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from '../utils/constants';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signup(dto: AuthSignupDto) {
    const { email, username, password } = dto;
    const foundUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (foundUser) {
      throw new BadRequestException(
        "Une erreur s'est produite lors de l'inscription. Veuillez réessayer.",
      );
    }
    const hashedPassword = await this.hashPassword(password);

    await this.prisma.user.create({
      data: {
        email,
        username,
        hashedPassword,
      },
    });
    return { message: 'signup was succesfull' };
  }
  async signin(dto: AuthSigninDto, req: Request, res: Response) {
    const { email, password } = dto;

    try {
      const foundUser = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!foundUser) {
        throw new BadRequestException('Mot de passe ou email incorrecte');
      }

      const isMatch = await this.comparePasswords({
        password,
        hash: foundUser.hashedPassword,
      });
      if (!isMatch) {
        throw new BadRequestException('Mot de passe ou email incorrecte');
      }
      const token = await this.signToken({
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
      });

      if (!token) {
        throw new ForbiddenException();
      }
      res.cookie('token', token);
      return res.send({
        message: 'Logged in succefully',
        user: {
          id: foundUser.id,
          email: foundUser.email,
          username: foundUser.username,
          role: foundUser.role,
        },
        token,
      });
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  }
  async signout(req: Request, res: Response) {
    res.clearCookie('token');
    return res.send({ message: 'logged out succesfully' });
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async comparePasswords(args: { password: string; hash: string }) {
    return await bcrypt.compare(args.password, args.hash);
  }

  async signToken(args: { id: string; email: string; role: string }) {
    const payload = args;

    return this.jwt.signAsync(payload, { secret: jwtSecret, expiresIn: '24h' });
  }

  async verifyToken(token: string) {
    try {
      const decoded = this.jwt.verify(token, { secret: jwtSecret });
      // Assuming the decoded token is an object containing a `role` property
      return { isAdmin: decoded.role === 'ADMIN' };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
