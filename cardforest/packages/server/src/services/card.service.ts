import { Injectable } from '@nestjs/common';
import { ArangoDBService } from './arangodb.service';

@Injectable()
export class CardService {
  constructor(private readonly arangoDBService: ArangoDBService) {}

  async createCard(
    title: string,
    content: string,
    createdBy: string,
  ): Promise<string> {
    // 修改返回类型
    try {
      const db = this.arangoDBService.getDatabase();
      const collection = db.collection('cards');

      const { _key } = await collection.save({
        title,
        content,
        createdBy,
      });
      return _key; // 返回创建的卡片的 _key
    } catch (error) {
      console.error('Failed to create card:', error);
      throw error; // 保证错误能被上层捕获
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

  async getCardsWithRelations(): Promise<any[]> {
    try {
      const db = this.arangoDBService.getDatabase();
      // 构建 AQL 查询
      const query = `
      FOR card IN cards
        LET relations = (
          FOR relation IN CardRelations
            FILTER relation._from == card._id
            FOR relatedCard IN cards
              FILTER relation._to == relatedCard._id
              RETURN relatedCard
        )
        RETURN {
          card,
          children: relations
        }
    `;
      // 执行查询
      const cursor = await db.query(query);
      const result = await cursor.all();
      return result;
    } catch (error) {
      console.error('Failed to get cards with relations:', error);
      return [];
    }
  }

  async createRelation(fromCardId: string, toCardId: string): Promise<void> {
    try {
      const db = this.arangoDBService.getDatabase();
      const edgeCollection = db.collection('CardRelations');

      await edgeCollection.save({
        _from: `cards/${fromCardId}`,
        _to: `cards/${toCardId}`,
      });
    } catch (error) {
      console.error('Failed to create card relation:', error);
      throw error;
    }
  }
}
