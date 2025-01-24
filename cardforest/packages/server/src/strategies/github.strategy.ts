import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private authService: AuthService, // 注入 AuthService
    private userService: UserService, // 注入 UserService
  ) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID, // 从环境变量中获取
      clientSecret: process.env.GITHUB_CLIENT_SECRET, // 从环境变量中获取
      callbackURL: 'http://localhost:3030/user/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    try {
      const username = profile.username;
      let user = await this.userService.findUserByUsername(username); // 假设这个方法在 UserService 中定义

      if (!user) {
        // 生成一个随机密码
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        
        // 创建新用户
        user = await this.userService.createUser(username, hashedPassword);
        
        if (!user) {
          throw new Error('Failed to create user');
        }
      }

      return done(null, {
        username: user.username,
        _key: user._key,
      });
    } catch (error) {
      console.error('GitHub validation error:', error);
      return done(error, null);
    }
  }
}
