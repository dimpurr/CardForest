import { Resolver, Query } from '@nestjs/graphql';
import { UserService } from '../services/user.service';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query()
  async users() {
    return this.userService.getUsers();
  }
}
