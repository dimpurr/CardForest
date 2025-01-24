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
        // 首先尝试从 Cookie 中获取 JWT
        (request: Request) => {
          const jwt = request?.cookies?.['jwt'];
          if (jwt) {
            return jwt;
          }
          // 如果 cookie 中没有，再尝试从 Authorization 头部获取
          const authHeader = request.headers.authorization;
          if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
            return authHeader.split(' ')[1];
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.userService.findUserByUsername(payload.username);
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      console.error('JWT validation error:', error);
      return null;
    }
  }
}
