import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    // Try to get token from Authorization header
    let token: string | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const [type, headerToken] = authHeader.split(' ');
      if (type === 'Bearer') {
        token = headerToken;
      }
    }

    // If no token in header, try to get from cookies
    if (!token && req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      console.log('No token found in either Authorization header or cookies');
      return false;
    }

    try {
      const payload = await this.authService.verifyToken(token);
      req.user = payload;
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  }
}
