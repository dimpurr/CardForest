import {
  Controller,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard'; // 假设你已经有一个JWT Auth Guard
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('current')
  getCurrentUser(@Request() req): any {
    // JwtAuthGuard 保证了 req.user 是存在的，因为它是由JWT策略填充的
    if (!req.user) {
      throw new UnauthorizedException();
    }
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('manager')
  async getAllUsers(): Promise<any[]> {
    // 这里你可能需要一些权限校验，确保只有管理员可以访问
    return await this.userService.getUsers();
  }
}
