import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '../services/jwt.service';
import { UserRepository } from '../repositories/user.repository';

/**
 * 可选 JWT 认证守卫
 * 用于不强制要求认证但需要用户信息的路由
 */
@Injectable()
export class OptionalJwtAuthGuard {
  private readonly logger = new Logger(OptionalJwtAuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * 检查请求是否可以继续
   * 不管认证是否成功，都允许请求继续
   * 
   * @param context 执行上下文
   * @returns 总是返回 true
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // 获取请求对象
      const request = this.getRequest(context);
      
      // 提取令牌
      const token = this.jwtService.extractTokenFromRequest(request);
      
      if (!token) {
        this.logger.debug('No token found in request, continuing as anonymous');
        return true;
      }
      
      try {
        // 验证令牌
        const payload = this.jwtService.validateToken(token);
        
        if (!payload || !payload.sub) {
          this.logger.debug('Invalid token payload, continuing as anonymous');
          return true;
        }
        
        // 获取用户
        const user = await this.userRepository.findByUserId(payload.sub);
        
        if (user) {
          // 将用户附加到请求对象
          request.user = user;
          this.logger.debug(`User authenticated: ${user.username}`);
        } else {
          this.logger.debug(`User not found: ${payload.sub}, continuing as anonymous`);
        }
      } catch (error) {
        this.logger.debug(`Token validation failed: ${error.message}, continuing as anonymous`);
      }
      
      return true;
    } catch (error) {
      this.logger.error(`Error in optional authentication: ${error.message}`, error.stack);
      return true;
    }
  }

  /**
   * 从执行上下文获取请求对象
   * 支持 HTTP 和 GraphQL 上下文
   * 
   * @param context 执行上下文
   * @returns Express 请求对象
   */
  private getRequest(context: ExecutionContext): any {
    // 检查是否是 GraphQL 上下文
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest();
    }
    
    // 获取 GraphQL 上下文
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
