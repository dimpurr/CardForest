import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  // 私有方法，用于生成含有过期时间的JWT令牌
  private generateToken(payload: any): string {
    return this.jwtService.sign(payload, { expiresIn: '24h' });
  }

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
      access_token: this.generateToken(payload), // 使用私有方法生成令牌
    };
  }

  async validateOAuthLogin(profile): Promise<string> {
    let user = await this.usersService.findUserByUsername(profile.username);

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = await this.usersService.createUser(
        profile.username,
        hashedPassword,
      );
    }

    const payload = { username: user.username, sub: user._key };
    return this.generateToken(payload); // 使用私有方法生成令牌
  }

  // ... 其他必要的方法 ...
}
