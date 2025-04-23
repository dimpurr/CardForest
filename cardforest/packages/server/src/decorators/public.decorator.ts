import { SetMetadata } from '@nestjs/common';

/**
 * 公共路由装饰器
 * 用于标记不需要认证的路由
 * 
 * 用法：
 * ```typescript
 * @Public()
 * @Query()
 * publicEndpoint() {
 *   return 'This endpoint is public';
 * }
 * ```
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
