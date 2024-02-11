import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../services/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 从请求的Authorization头中提取JWT
      ignoreExpiration: false, // 默认不忽略过期Token
      secretOrKey: process.env.JWT_SECRET, // 用于验证Token签名的密钥
    });
  }

  async validate(payload: any) {
    // Payload已经是JWT令牌验证之后的结果，包含了JWT的claims，例如sub、username等
    const user = await this.userService.findUserByUsername(payload.username);
    if (!user) {
      // 根据你的应用逻辑，这里可以抛出一个异常，或者返回null
      return null;
    }
    return user; // 这里返回的对象将会被添加到Request对象的user属性上
  }
}
