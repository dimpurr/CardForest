import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { AuthService } from '../services/auth.service';
import { JwtService } from '../services/jwt.service';
import { AuthController } from '../controllers/auth.controller';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../guards/optional-jwt-auth.guard';
import { UserModule } from './user.module';
import { ArangoDBService } from '../services/arangodb.service';
import { RepositoryModule } from './repository.module';

@Module({
  imports: [
    UserModule,
    RepositoryModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
      property: 'user'
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '24h',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    JwtStrategy,
    JwtAuthGuard,
    OptionalJwtAuthGuard,
    ArangoDBService
  ],
  exports: [
    AuthService,
    JwtService,
    JwtModule,
    JwtAuthGuard,
    OptionalJwtAuthGuard
  ],
})
export class AuthModule {}
