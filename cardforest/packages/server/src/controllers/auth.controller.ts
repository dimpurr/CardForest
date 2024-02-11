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
import { AuthService } from '../services/auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('user/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService, // 注入 JwtService 以解码 token
  ) {}
  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubAuth() {
    // Passport 自动处理 GitHub 登录流程
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(@Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    // 这里我们假设 req.user 对象包含 GitHub profile 信息
    const access_token = await this.authService.validateOAuthLogin(req.user);

    // 设置 HttpOnly cookie
    res.cookie('jwt', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    // 重定向到前端页面，而不是带有 token 的 URL
    // const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3030';

    // 从查询参数获取动态的回调 URL
    // const callbackUrl = req.query.callbackUrl || `${frontendUrl}/auth-callback`;
    const callbackUrl = 'http://localhost:3030/user/auth/auth-callback-backend';

    // 重定向到提供的回调 URL 或默认回调 URL
    res.redirect(callbackUrl);
  }

  @Get('auth-callback-backend')
  authCallbackBackend(@Req() req: Request, @Res() res: Response) {
    try {
      const jwt = req.cookies['jwt']; // 假设用户的 JWT 存储在名为 'jwt' 的 cookie 中
      const payload = this.jwtService.verify(jwt); // 验证并解码 JWT

      // 显示简单的 HTML 页面以显示用户信息和 token
      res.send(`
        <h1>登录成功</h1>
        <p>用户名: ${payload.username}   payload: ${JSON.stringify(payload)}</p>
        <p>Token: ${jwt}</p>
      `);
    } catch (e) {
      // 如果 token 验证失败或没有提供 token，显示错误信息
      res.send(`<h1>未授权</h1><p>无效的 token 或 token 未提供。</p>`);
    }
  }
}
