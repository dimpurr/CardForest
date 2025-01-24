import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return false;
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer') {
      return false;
    }

    try {
      const payload = await this.authService.verifyToken(token);
      req.user = payload;
      return true;
    } catch (error) {
      return false;
    }
  }
}
