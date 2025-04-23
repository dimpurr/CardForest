import { AppError } from './app.error';

/**
 * 验证错误
 * 用于表示输入数据验证失败
 */
export class ValidationError extends AppError {
  /**
   * 构造函数
   * @param message 错误消息
   * @param data 额外数据，通常包含验证错误的详细信息
   */
  constructor(message: string = 'Validation failed', data?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', 400, data);
    
    // 设置原型链，使 instanceof 操作符可以正常工作
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
