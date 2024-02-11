import { Injectable } from '@nestjs/common';
import { UserService } from './services/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService, // 实现 UsersService 以处理用户相关的数据库操作
    private jwtService: JwtService, // JWT 服务用于生成和验证令牌
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    // 查找用户是否存在
    const user = await this.usersService.findUserByUsername(username);

    // 如果用户存在且密码比较匹配
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user; // 不返回密码字段
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

  // ... 其他必要的方法 ...
}
