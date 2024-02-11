import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services/auth.service'; // 需要实现 AuthService
import { GithubStrategy } from './strategies/github.strategy'; // 需要实现 GithubStrategy
import { AuthController } from './auth.controller';
import { UserService } from './services/user.service'; // 需要实现 UsersService
import { JwtModule } from '@nestjs/jwt'; // 需要安装并配置 JWT 模块

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // 从环境变量获取或者定义一个固定的
      signOptions: { expiresIn: '60s' }, // 根据需要设置过期时间
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GithubStrategy, UserService],
  exports: [AuthService], // 如果需要在其他地方注入 AuthService，需要 export 它
})
export class AuthModule {}
