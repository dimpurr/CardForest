import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { UserModule } from './user.module';
import { ArangoDBService } from '../services/arangodb.service';

@Module({
  imports: [
    UserModule,
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
  providers: [AuthService, JwtStrategy, ArangoDBService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
