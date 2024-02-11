import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubAuth() {
    // initiates the GitHub OAuth2 login flow
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(@Req() req: Request, @Res() res: Response) {
    // handles the GitHub OAuth2 callback
    // 用户信息现在可以通过 req.user 访问
    // 通常这里会生成一个 token 发送给客户端或者重定向到一个新页面
    const user = req.user;
    const token = await this.authService.login(user);
    res.redirect(`/?token=${token.access_token}`);
  }
}
