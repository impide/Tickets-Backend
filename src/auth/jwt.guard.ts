import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    console.log(info);

    if (err || !user) {
      console.log(err);

      if (info && info.message === 'No auth token') {
        throw new UnauthorizedException({
          message: 'No auth token',
          shouldClearLocalStorage: true,
        });
      }

      if (info && info.name === 'TokenExpiredError') {
        throw new UnauthorizedException({
          message: 'Token expired',
          shouldClearLocalStorage: true,
        });
      }
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
