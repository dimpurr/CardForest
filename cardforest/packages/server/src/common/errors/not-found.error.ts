import { AppError } from './app.error';

/**
 * 资源未找到错误
 * 用于表示请求的资源不存在
 */
export class NotFoundError extends AppError {
  /**
   * 构造函数
   * @param message 错误消息
   * @param data 额外数据
   */
  constructor(message: string = 'Resource not found', data?: Record<string, any>) {
    super(message, 'NOT_FOUND', 404, data);
    
    // 设置原型链，使 instanceof 操作符可以正常工作
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
