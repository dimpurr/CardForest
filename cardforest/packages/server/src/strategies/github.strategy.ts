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
      console.log('GitHub profile:', JSON.stringify(profile, null, 2));

      if (!profile || !profile.username) {
        console.error('Invalid GitHub profile:', profile);
        throw new Error('Invalid GitHub profile: missing username');
      }

      const username = profile.username;
      console.log('Attempting to find user:', username);

      let user = await this.userService.findUserByUsername(username);

      if (!user) {
        console.log('User not found, creating new user:', username);

        // 生成一个随机密码
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        // 创建新用户
        user = await this.userService.createUser(username, hashedPassword);

        if (!user) {
          console.error('Failed to create user:', username);
          throw new Error('Failed to create user');
        }

        console.log('New user created:', username);
      } else {
        console.log('Existing user found:', username);
      }

      // 返回更多用户信息，确保包含所有可能需要的属性
      console.log('User object from database:', user);

      // 确保我们有一个有效的 _key
      if (!user._key) {
        console.error('User object does not have a _key property:', user);
        user._key = user._id ? user._id.split('/')[1] : String(Date.now());
        console.log('Generated _key:', user._key);
      }

      return done(null, {
        username: user.username,
        _key: user._key,
        id: user._key,  // 为了兼容性
        name: user.username,  // 为了兼容性
        login: user.username,  // 为了兼容性
        email: user.email || `${user.username}@example.com`,
        profile: profile,  // 保存原始 GitHub 资料
      });
    } catch (error) {
      console.error('GitHub validation error:', error);
      return done(error, null);
    }
  }
}
