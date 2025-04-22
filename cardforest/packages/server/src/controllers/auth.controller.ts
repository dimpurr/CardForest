import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Res,
  Body,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { JwtService } from '@nestjs/jwt';

// NOTE: 后端 debug 的页面都保持简洁的 html 形式

// NOTE: 这是给后端自己 debug 用的后端登录流程，别跳到前端
@Controller('user/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

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
  githubAuthCallbackGet(@Req() req: Request, @Res() res: Response) {
    this.logger.log('GitHub callback received');

    // 生成 JWT token
    const user = req.user as any;
    // 确保我们有所需的属性
    console.log('User from GitHub strategy:', user);

    // 处理可能的用户对象结构
    let sub = 'unknown';
    let username = 'unknown';

    if (user) {
      if (user._key) {
        sub = user._key;
      } else if (user.id) {
        sub = user.id;
      } else if (user._id) {
        sub = user._id.split('/')[1];
      }

      if (user.username) {
        username = user.username;
      } else if (user.login) {
        username = user.login;
      } else if (user.name) {
        username = user.name;
      }
    }

    console.log('Generated JWT payload:', { sub, username });
    const token = this.jwtService.sign({ sub, username });

    // 设置 cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // 重定向到前端
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    // 将用户重定向到前端的卡片页面
    // 并添加 debug 参数以显示调试信息
    res.redirect(`${frontendUrl}/cards?debug=true&auth=backend&token=${encodeURIComponent(token)}`);
  }

  @Post('github/callback')
  async githubAuthCallbackPost(@Body() data: any) {
    this.logger.log('Received OAuth callback:', {
      provider: data.provider,
      hasAccessToken: !!data.access_token,
      hasProviderId: !!data.providerId,
      providerId: data.providerId,
      profile: data.profile,
    });

    if (!data.access_token || !data.profile) {
      this.logger.error('Invalid OAuth data:', data);
      throw new UnauthorizedException('Invalid OAuth data');
    }

    try {
      // 使用 access_token 和 profile 生成 JWT
      const jwt = await this.authService.validateOAuthLogin({
        provider: data.provider,
        providerId: data.providerId,
        profile: data.profile,
        accessToken: data.access_token,
      });

      this.logger.log('JWT generated successfully');
      return { jwt };
    } catch (error) {
      this.logger.error('JWT generation failed:', error);
      throw new UnauthorizedException('Failed to validate OAuth login');
    }
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
