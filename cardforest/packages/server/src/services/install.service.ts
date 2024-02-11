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
    await this.arangoDBService.clearDatabase();
    await this.arangoDBService.createDatabase();
    await this.arangoDBService.createCollections();
    await this.arangoDBService.createEdgeCollections();
    await this.arangoDBService.createGraph();
    await this.createDefaultUser();
    await this.createDefaultCard();
    await this.createDefaultCards();
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

  async createDefaultCards(): Promise<void> {
    try {
      const card1Id = await this.cardService.createCard(
        'Hello',
        'This is the default 1',
        'admin',
      );
      const card2Id = await this.cardService.createCard(
        'Card 2',
        'Content for card 2',
        'admin',
      );
      const card3Id = await this.cardService.createCard(
        'Card 3',
        'Content for card 3',
        'admin',
      );
      const card4Id = await this.cardService.createCard(
        'Card 4',
        'Content for card 4',
        'admin',
      );

      // 建立卡片之间的 child 关系
      await this.cardService.createRelation(card1Id, card2Id);
      await this.cardService.createRelation(card2Id, card3Id);
      await this.cardService.createRelation(card3Id, card1Id); // 创建环形关系
      await this.cardService.createRelation(card4Id, card1Id);
      await this.cardService.createRelation(card4Id, card3Id);
    } catch (error) {
      console.error('Failed to create default cards and relations:', error);
    }
  }
}
