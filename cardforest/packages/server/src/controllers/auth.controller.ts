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

// NOTE: 后端 debug 的页面都保持简洁的 html 形式

// NOTE: 这是给后端自己 debug 用的后端登录流程，别跳到前端
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

    // 生成 JWT token
    const access_token = await this.authService.validateOAuthLogin(req.user);

    // 设置 JWT cookie
    res.cookie('jwt', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    // 重定向到成功页面
    res.redirect('/user/auth/auth-callback-backend');
  }

  // NOTE: 这是后端 debug 自己的登录成功界面
  @Get('auth-callback-backend')
  authCallbackBackend(@Req() req: Request, @Res() res: Response) {
    try {
      const jwt = req.cookies['jwt'];
      const payload = this.jwtService.verify(jwt);

      res.send(`
        <h1>登录成功</h1>
        <p>用户名: ${payload.username}   payload: ${JSON.stringify(payload)}</p>
        <p>Token: ${jwt}</p>
        <p><a href="/user/auth/logout">登出</a></p>
      `);
    } catch (e) {
      res.send(
        `<h1>未授权</h1><p>无效的 token 或 token 未提供。</p><p><a href="/user/auth/github">重新登录</a></p>`,
      );
    }
  }

  @Get('logout')
  logout(@Res() res: Response) {
    // 清除 JWT cookie
    res.clearCookie('jwt');

    // 显示登出成功页面
    res.send(`
          <h1>CardForest Debug - 登出成功</h1>
          <a href="/user/auth/github" class="button">重新登录</a>
    `);
  }
}
