import { Logger } from '@nestjs/common';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { AppError } from '../errors/app.error';

/**
 * GraphQL 异常过滤器
 * 用于格式化 GraphQL 错误
 */
export class GraphqlExceptionFilter {
  private readonly logger = new Logger(GraphqlExceptionFilter.name);

  /**
   * 格式化 GraphQL 错误
   * @param error GraphQL 错误
   * @returns 格式化后的错误
   */
  formatError(error: GraphQLError): GraphQLFormattedError {
    const originalError = error.originalError;

    // 记录错误日志
    this.logger.error(
      `GraphQL Error: ${error.message}`,
      originalError instanceof Error ? originalError.stack : undefined,
    );

    // 处理自定义 AppError
    if (originalError instanceof AppError) {
      return {
        message: originalError.message,
        extensions: {
          code: originalError.code,
          statusCode: originalError.statusCode,
          data: originalError.data,
          stacktrace: process.env.NODE_ENV === 'development' ? originalError.stack?.split('\n') : undefined,
        },
      };
    }

    // 处理其他错误
    return {
      message: error.message,
      extensions: {
        code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
        stacktrace: process.env.NODE_ENV === 'development' ? error.stack?.split('\n') : undefined,
        path: error.path,
      },
    };
  }
}
