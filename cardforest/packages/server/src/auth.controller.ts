import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubAuth() {
    // Passport 自动处理 GitHub 登录流程
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(@Req() req: Request, @Res() res: Response) {
    // Passport 会处理认证并在请求对象中注入用户信息
    // 如果认证失败，用户将不会被注入，并且 Passport 抛出一个错误
    if (!req.user) {
      throw new UnauthorizedException();
    }

    // 用户信息已通过 Passport 策略的 validate 方法被验证并添加到 req.user
    const user = req.user;

    // 在 AuthService 中执行登录逻辑，例如生成 JWT
    const loginResult = await this.authService.login(user);

    // 定义你的前端 URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    // 将用户重定向到前端应用，携带 JWT
    // 注意：将 token 作为 URL 参数传递可能不是最安全的方式，具体取决于你的应用情况
    // 可能更安全的方案是设置一个 HttpOnly 的 cookie 或者通过某种形式的后端存储
    res.redirect(
      `${frontendUrl}/auth-callback?token=${loginResult.access_token}`,
    );
  }
}
