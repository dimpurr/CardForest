import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserUtils } from '../utils/user.utils';

/**
 * 当前用户装饰器
 * 用于从请求中提取当前用户信息
 *
 * 用法：
 * ```typescript
 * @Query()
 * getMyProfile(@CurrentUser() user: User) {
 *   return this.userService.getProfile(user);
 * }
 * ```
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    // 获取 GraphQL 上下文
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    // 从请求中获取用户
    const user = req.user;

    // 标准化用户对象
    return UserUtils.normalizeUser(user);
  },
);

/**
 * 当前用户 ID 装饰器
 * 用于从请求中提取当前用户 ID
 *
 * 用法：
 * ```typescript
 * @Query()
 * getMyCards(@CurrentUserId() userId: string) {
 *   return this.cardService.getCardsByUserId(userId);
 * }
 * ```
 */
export const CurrentUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    // 获取 GraphQL 上下文
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    // 从请求中获取用户
    const user = req.user;

    // 提取用户 ID
    return UserUtils.extractUserId(user);
  },
);
