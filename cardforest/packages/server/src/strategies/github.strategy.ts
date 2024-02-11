import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from '../auth.service';
import { UserService } from '../services/user.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private authService: AuthService, // 注入 AuthService
    private userService: UserService, // 注入 UserService
  ) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID, // 从环境变量中获取
      clientSecret: process.env.GITHUB_CLIENT_SECRET, // 从环境变量中获取
      callbackURL: 'http://localhost:3000/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(accessToken, refreshToken, profile, done) {
    // 基于 GitHub 信息尝试获取或创建用户
    const username = profile.username;
    let user = await this.userService.findUserByUsername(username); // 假设这个方法在 UserService 中定义

    if (!user) {
      user = await this.userService.createUser(username, 'default-password'); // 应该有更安全的处理方式
    }

    return done(null, user);
  }
}
