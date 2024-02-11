import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UserService } from '../services/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // 尝试从 Authorization 头部获取 Bearer Token
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        // 如果上面没有找到，尝试从 Cookie 中获取 JWT
        (request: Request) => {
          return request?.cookies?.['jwt'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findUserByUsername(payload.username);
    if (!user) {
      return null;
    }
    return user;
  }
}
