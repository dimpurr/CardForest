import { AppError } from './app.error';

/**
 * 未授权错误
 * 用于表示用户未登录或认证失败
 */
export class UnauthorizedError extends AppError {
  /**
   * 构造函数
   * @param message 错误消息
   * @param data 额外数据
   */
  constructor(message: string = 'Authentication required', data?: Record<string, any>) {
    super(message, 'UNAUTHORIZED', 401, data);
    
    // 设置原型链，使 instanceof 操作符可以正常工作
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
