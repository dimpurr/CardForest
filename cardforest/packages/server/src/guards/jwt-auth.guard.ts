import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { JwtService } from '../services/jwt.service';
import { UserRepository } from '../repositories/user.repository';
import { UnauthorizedError } from '../common/errors';

/**
 * JWT 认证守卫
 * 用于保护需要认证的路由和解析器
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private readonly jwtService?: JwtService,
    private readonly userRepository?: UserRepository,
  ) {
    super();
  }

  /**
   * 检查请求是否可以继续
   * @param context 执行上下文
   * @returns 是否允许请求继续
   */
  canActivate(context: ExecutionContext) {
    this.logger.debug('Checking JWT authentication');

    // 获取 GraphQL 上下文
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    // 如果注入了 JwtService，使用自定义验证逻辑
    if (this.jwtService && this.userRepository) {
      return this.customActivate(req);
    }

    // 否则使用 Passport 验证
    return super.canActivate(new ExecutionContextHost([req]));
  }

  /**
   * 自定义验证逻辑
   * 从多个来源提取和验证 JWT
   *
   * @param request 请求对象
   * @returns 是否允许请求继续
   */
  private async customActivate(request: any): Promise<boolean> {
    try {
      // 提取令牌
      const token = this.jwtService?.extractTokenFromRequest(request);

      if (!token) {
        this.logger.debug('No token found in request');
        throw new UnauthorizedError('Authentication required');
      }

      // 验证令牌
      const payload = this.jwtService?.validateToken(token);

      if (!payload || !payload.sub) {
        this.logger.debug('Invalid token payload');
        throw new UnauthorizedError('Invalid token payload');
      }

      // 获取用户
      const user = await this.userRepository?.findByUserId(payload.sub);

      if (!user) {
        this.logger.debug(`User not found: ${payload.sub}`);
        throw new UnauthorizedError('User not found');
      }

      // 将用户附加到请求对象
      request.user = user;

      this.logger.debug(`User authenticated: ${user.username}`);
      return true;
    } catch (error) {
      this.logger.error(`Authentication failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 处理 Passport 验证结果
   * @param err 错误
   * @param user 用户
   * @returns 用户对象
   */
  handleRequest(err: any, user: any) {
    if (err) {
      this.logger.error(`Auth Error: ${err.message}`, err.stack);
      throw new UnauthorizedError('Authentication failed', { error: err.message });
    }

    if (!user) {
      this.logger.debug('No user found after authentication');
      throw new UnauthorizedError('Authentication failed');
    }

    this.logger.debug(`User authenticated: ${user.username || user.sub}`);
    return user;
  }
}
