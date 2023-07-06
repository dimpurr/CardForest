import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { CardService } from './card.service';
import { ArangoDBService } from './arangodb.service';

@Injectable()
export class InstallService {
  constructor(
    private readonly userService: UserService,
    private readonly cardService: CardService,
    private readonly arangoDBService: ArangoDBService,
  ) {}

  async install(): Promise<any[]> {
    await this.arangoDBService.createDatabase();
    await this.arangoDBService.createCollections();
    await this.createDefaultUser();
    await this.createDefaultCard();
    const [users, cards] = await Promise.all([
      this.userService.getUsers(),
      this.cardService.getCards(),
    ]);
    return [...users, ...cards];
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
