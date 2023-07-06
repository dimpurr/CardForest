import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { CardService } from './card.service';

@Injectable()
export class InstallService {
  constructor(
    private readonly userService: UserService,
    private readonly cardService: CardService,
  ) {}

  async install(): Promise<void> {
    await this.createDefaultUser();
    await this.createDefaultCard();
  }

  async createDefaultUser(): Promise<void> {
    const username = 'admin';
    const password = 'admin';
    await this.userService.createUser(username, password);
  }

  async createDefaultCard(): Promise<void> {
    const title = 'Hello';
    const content = 'This is the default card';
    const createdBy = 'admin';
    await this.cardService.createCard(title, content, createdBy);
  }
}
