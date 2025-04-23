import { AppError } from './app.error';

/**
 * 禁止访问错误
 * 用于表示用户没有权限访问资源
 */
export class ForbiddenError extends AppError {
  /**
   * 构造函数
   * @param message 错误消息
   * @param data 额外数据
   */
  constructor(message: string = 'Access forbidden', data?: Record<string, any>) {
    super(message, 'FORBIDDEN', 403, data);
    
    // 设置原型链，使 instanceof 操作符可以正常工作
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
