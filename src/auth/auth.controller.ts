import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignupDto, AuthSigninDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthSignupDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: AuthSigninDto, @Req() req, @Res() res) {
    return this.authService.signin(dto, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-token')
  verifyToken(@Body('token') token: string, @Req() req, @Res() res) {
    return this.authService.verifyToken(token, req, res);
  }

  @Get('signout')
  signout(@Req() req, @Res() res) {
    return this.authService.signout(req, res);
  }
}
