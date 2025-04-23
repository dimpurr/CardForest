import { Injectable, Logger } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserPayload } from '../interfaces/user.interface';
import { UnauthorizedError } from '../common/errors';

/**
 * JWT 服务
 * 处理 JWT 令牌的生成、验证和提取
 */
@Injectable()
export class JwtService {
  private readonly logger = new Logger(JwtService.name);

  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 生成 JWT 令牌
   * @param payload 载荷数据
   * @param expiresIn 过期时间，默认从配置中获取
   * @returns JWT 令牌
   */
  generateToken(payload: UserPayload, expiresIn?: string): string {
    try {
      this.logger.debug(`Generating token for user: ${payload.sub}`);
      
      // 获取配置的过期时间，默认为 24 小时
      const configExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '24h');
      
      return this.jwtService.sign(payload, { 
        expiresIn: expiresIn || configExpiresIn,
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch (error) {
      this.logger.error(`Failed to generate token: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 验证 JWT 令牌
   * @param token JWT 令牌
   * @returns 令牌载荷
   */
  validateToken(token: string): UserPayload {
    try {
      this.logger.debug('Validating token');
      
      if (!token) {
        throw new UnauthorizedError('Token is required');
      }
      
      return this.jwtService.verify<UserPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch (error) {
      this.logger.error(`Token validation failed: ${error.message}`, error.stack);
      throw new UnauthorizedError('Invalid token', { error: error.message });
    }
  }

  /**
   * 从请求中提取 JWT 令牌
   * 按照以下顺序尝试提取：
   * 1. Authorization 头部（Bearer token）
   * 2. Cookies（jwt）
   * 3. URL 参数（token）
   * 
   * @param request Express 请求对象
   * @returns JWT 令牌或 null
   */
  extractTokenFromRequest(request: Request): string | null {
    try {
      // 从 Authorization 头部提取
      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        this.logger.debug('Token extracted from Authorization header');
        return token;
      }

      // 从 Cookies 提取
      if (request.cookies && request.cookies.jwt) {
        this.logger.debug('Token extracted from cookies');
        return request.cookies.jwt;
      }

      // 从 URL 参数提取
      if (request.query && request.query.token) {
        const token = request.query.token as string;
        this.logger.debug('Token extracted from URL parameter');
        return token;
      }

      this.logger.debug('No token found in request');
      return null;
    } catch (error) {
      this.logger.error(`Failed to extract token: ${error.message}`, error.stack);
      return null;
    }
  }
}
