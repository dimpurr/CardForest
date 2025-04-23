/**
 * 应用基础错误类
 * 所有自定义错误都应该继承这个类
 */
export class AppError extends Error {
  /**
   * 错误代码
   */
  public readonly code: string;

  /**
   * HTTP 状态码
   */
  public readonly statusCode: number;

  /**
   * 额外数据
   */
  public readonly data?: Record<string, any>;

  /**
   * 构造函数
   * @param message 错误消息
   * @param code 错误代码
   * @param statusCode HTTP 状态码
   * @param data 额外数据
   */
  constructor(
    message: string,
    code: string = 'INTERNAL_ERROR',
    statusCode: number = 500,
    data?: Record<string, any>,
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.data = data;

    // 设置原型链，使 instanceof 操作符可以正常工作
    Object.setPrototypeOf(this, AppError.prototype);
    
    // 设置错误名称为构造函数名称
    this.name = this.constructor.name;
    
    // 捕获堆栈跟踪
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * 转换为 JSON 对象
   * 用于序列化错误
   */
  toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      data: this.data,
      stack: process.env.NODE_ENV === 'development' ? this.stack : undefined,
    };
  }
}
