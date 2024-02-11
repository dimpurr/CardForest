import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService, // 实现 UsersService 以处理用户相关的数据库操作
    private jwtService: JwtService, // JWT 服务用于生成和验证令牌
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByUsername(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._key };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateOAuthLogin(profile): Promise<string> {
    // 根据第三方服务提供的信息查找或创建用户
    let user = await this.usersService.findUserByUsername(profile.username);

    if (!user) {
      // 为新用户创建账号，此处应该生成一个随机密码或特定于应用的账户创建策略
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = await this.usersService.createUser(
        profile.username,
        hashedPassword,
      );
    }

    // 为用户生成 JWT
    const payload = { username: user.username, sub: user._key };
    const access_token = this.jwtService.sign(payload);

    return access_token;
  }

  // ... 其他必要的方法 ...
}
