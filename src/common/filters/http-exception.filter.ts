import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppError } from '../errors/app.error';

/**
 * HTTP 异常过滤器
 * 处理所有 HTTP 异常和自定义错误
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  /**
   * 捕获并处理异常
   * @param exception 异常对象
   * @param host 参数宿主
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 提取状态码和响应体
    const { status, body } = this.getErrorResponse(exception);

    // 记录错误日志
    this.logger.error(
      `${request.method} ${request.url} - ${status}: ${body.message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    // 发送响应
    response.status(status).json({
      ...body,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  /**
   * 获取错误响应
   * @param exception 异常对象
   * @returns 状态码和响应体
   */
  private getErrorResponse(exception: unknown): { status: number; body: Record<string, any> } {
    // 处理自定义 AppError
    if (exception instanceof AppError) {
      return {
        status: exception.statusCode,
        body: {
          code: exception.code,
          message: exception.message,
          data: exception.data,
        },
      };
    }

    // 处理 NestJS HttpException
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const status = exception.getStatus();
      const body =
        typeof response === 'object'
          ? response
          : {
              code: 'HTTP_ERROR',
              message: response,
            };

      return { status, body };
    }

    // 处理其他错误
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof Error
        ? exception.message
        : 'An unexpected error occurred';

    return {
      status,
      body: {
        code: 'INTERNAL_SERVER_ERROR',
        message,
        stack: process.env.NODE_ENV === 'development' && exception instanceof Error
          ? exception.stack
          : undefined,
      },
    };
  }
}
