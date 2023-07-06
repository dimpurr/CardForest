import { Injectable } from '@nestjs/common';
import { ArangoDBService } from './arangodb.service';

@Injectable()
export class CardService {
  constructor(private readonly arangoDBService: ArangoDBService) {}

  async createCard(
    title: string,
    content: string,
    createdBy: string,
  ): Promise<void> {
    try {
      const db = this.arangoDBService.getDatabase();
      const collection = db.collection('cards');

      await collection.save({
        title,
        content,
        createdBy,
      });
    } catch (error) {
      console.error('Failed to create card:', error);
    }
  }

  async getCards(): Promise<any[]> {
    try {
      const db = this.arangoDBService.getDatabase();
      const collection = db.collection('cards');

      const cursor = await collection.all();
      const cards = await cursor.all();
      return cards;
    } catch (error) {
      console.error('Failed to get cards:', error);
      return [];
    }
  }
}
