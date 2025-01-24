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
        // 首先尝试从 Authorization 头部获取
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        // 然后尝试从 Cookie 中获取
        (request: Request) => {
          const jwt = request?.cookies?.['jwt'];
          if (jwt) {
            console.log('JWT found in cookie:', jwt);
            return jwt;
          }
          console.log('No JWT in cookie');
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    try {
      console.log('Validating JWT payload:', payload);
      const user = await this.userService.findUserByUsername(payload.username);
      if (!user) {
        console.log('User not found:', payload.username);
        return null;
      }
      console.log('User validated:', user.username);
      return user;
    } catch (error) {
      console.error('JWT validation error:', error);
      return null;
    }
  }
}
