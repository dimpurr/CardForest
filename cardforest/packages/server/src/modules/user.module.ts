import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { AuthController } from '../controllers/auth.controller'; // 引入 AuthController
import { AuthService } from '../services/auth.service';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GithubStrategy } from '../strategies/github.strategy';
import { DatabaseModule } from './database.module';
import { RepositoryModule } from './repository.module';
import { UserResolver } from '../graphql/user.resolver';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    DatabaseModule,
    RepositoryModule,
  ],
  controllers: [UserController, AuthController], // 现在包含 AuthController
  providers: [
    UserService,
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    GithubStrategy,
    UserResolver,
  ],
  exports: [UserService, AuthService],
})
export class UserModule {}
