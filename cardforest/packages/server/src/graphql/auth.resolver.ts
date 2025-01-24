import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation('login')
  async login(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    return this.authService.loginByUsername({ username, password });
  }

  @Mutation('register')
  async register(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    return this.authService.registerByUsername(username, password);
  }

  @Query('me')
  @UseGuards(AuthGuard)
  async me(@CurrentUser() userId: string) {
    return this.authService.getUserById(userId);
  }
}
