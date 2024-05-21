import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UserDto } from './dto/user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  getMyUser(@Param() params: { id: string }, @Req() req) {
    return this.usersService.getMyUser(params.id, req);
  }

  @Get('/')
  getUsers() {
    return this.usersService.getUsers();
  }

  @Delete(':id')
  deleteUser(@Param() params: { id: string }, @Req() req) {
    return this.usersService.deleteUser(params.id, req);
  }

  @Put(':id')
  updatePost(
    @Body() dto: UserDto,
    @Param() params: { id: string },
    @Req() req,
  ) {
    return this.usersService.updateUser(dto, params.id, req);
  }
}
