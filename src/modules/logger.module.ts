import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

/**
 * 日志模块
 * 集成 nestjs-pino 提供结构化日志
 */
@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV !== 'production'
          ? {
              target: 'pino-pretty',
              options: {
                singleLine: true,
                colorize: true,
                levelFirst: true,
                translateTime: 'yyyy-mm-dd HH:MM:ss.l',
              },
            }
          : undefined,
        level: process.env.LOG_LEVEL || 'info',
        // 请求日志中排除敏感信息
        redact: {
          paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'res.headers["set-cookie"]',
            '*.password',
            '*.token',
          ],
          censor: '[REDACTED]',
        },
        // 自定义序列化
        serializers: {
          req(req) {
            return {
              id: req.id,
              method: req.method,
              url: req.url,
              query: req.query,
              params: req.params,
              headers: req.headers,
              remoteAddress: req.remoteAddress,
              remotePort: req.remotePort,
            };
          },
        },
        // 自定义请求日志
        customProps: (req, res) => {
          return {
            context: 'HTTP',
            user: req.user?.sub || req.user?._key || 'anonymous',
          };
        },
        // 自定义成功级别
        customSuccessMessage: (req, res) => {
          return `${req.method} ${req.url} ${res.statusCode}`;
        },
        // 自定义错误级别
        customErrorMessage: (req, res, error) => {
          return `${req.method} ${req.url} ${res.statusCode}: ${error.message}`;
        },
        // 自定义日志级别
        customLogLevel: (req, res, error) => {
          if (res.statusCode >= 500 || error) {
            return 'error';
          }
          if (res.statusCode >= 400) {
            return 'warn';
          }
          if (res.statusCode >= 300) {
            return 'info';
          }
          return 'debug';
        },
      },
    }),
  ],
  exports: [PinoLoggerModule],
})
export class LoggerModule {}
