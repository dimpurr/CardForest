import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { CardService } from './card.service';
import { ArangoDBService } from './arangodb.service';

// NOTE: This service is only used for the initial installation of the database.

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
      // Get admin user ID first
      const adminUser = await this.userService.findUserByUsername('admin');
      if (!adminUser) {
        throw new Error('Admin user not found');
      }
      const adminId = adminUser._id;

      const card1 = await this.cardService.createCard(
        'Hello',
        'This is the default 1',
        adminId,
      );
      const card2 = await this.cardService.createCard(
        'Card 2',
        'Content for card 2',
        adminId,
      );
      const card3 = await this.cardService.createCard(
        'Card 3',
        'Content for card 3',
        adminId,
      );
      const card4 = await this.cardService.createCard(
        'Card 4',
        'Content for card 4',
        adminId,
      );

      // Extract card IDs from the returned card objects
      const card1Id = card1._key;
      const card2Id = card2._key;
      const card3Id = card3._key;
      const card4Id = card4._key;

      // 建立卡片之间的 child 关系
      await this.cardService.createRelation(card1Id, card2Id, adminId);
      await this.cardService.createRelation(card2Id, card3Id, adminId);
      await this.cardService.createRelation(card3Id, card1Id, adminId); // 创建环形关系
      await this.cardService.createRelation(card4Id, card1Id, adminId);
      await this.cardService.createRelation(card4Id, card3Id, adminId);
    } catch (error) {
      console.error('Failed to create default cards and relations:', error);
      throw error; // Re-throw the error to properly handle it in the install method
    }
  }
}
