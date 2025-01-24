import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ArangoDBService } from './arangodb.service';

@Injectable()
export class CardService {
  constructor(private readonly arangoDBService: ArangoDBService) {}

  async createCard(
    title: string,
    content: string,
    userId: string,
  ): Promise<any> {
    try {
      const db = this.arangoDBService.getDatabase();
      const collection = db.collection('cards');

      const now = new Date().toISOString();
      const card = await collection.save({
        title,
        content,
        createdBy: userId,
        createdAt: now,
        updatedAt: now,
      });
      
      return this.getCardById(card._key);
    } catch (error) {
      console.error('Failed to create card:', error);
      throw error;
    }
  }

  async getCardById(cardId: string): Promise<any> {
    try {
      const db = this.arangoDBService.getDatabase();
      const query = `
        FOR card IN cards
          FILTER card._key == @cardId
          LET creator = FIRST(
            FOR user IN users
              FILTER user._id == card.createdBy
              RETURN {
                _id: user._id,
                username: user.username
              }
          )
          RETURN MERGE(card, { createdBy: creator })
      `;
      const cursor = await db.query(query, { cardId });
      const card = await cursor.next();
      if (!card) {
        throw new NotFoundException(`Card with ID ${cardId} not found`);
      }
      return card;
    } catch (error) {
      console.error('Failed to get card:', error);
      throw error;
    }
  }

  async getCards(): Promise<any[]> {
    try {
      const db = this.arangoDBService.getDatabase();
      const query = `
        FOR card IN cards
          LET creator = FIRST(
            FOR user IN users
              FILTER user._id == card.createdBy
              RETURN {
                _id: user._id,
                username: user.username
              }
          )
          RETURN MERGE(card, { createdBy: creator })
      `;
      const cursor = await db.query(query);
      return cursor.all();
    } catch (error) {
      console.error('Failed to get cards:', error);
      return [];
    }
  }

  async getCardsByUserId(userId: string): Promise<any[]> {
    try {
      const db = this.arangoDBService.getDatabase();
      const query = `
        FOR card IN cards
          FILTER card.createdBy == @userId
          LET creator = FIRST(
            FOR user IN users
              FILTER user._id == card.createdBy
              RETURN {
                _id: user._id,
                username: user.username
              }
          )
          RETURN MERGE(card, { createdBy: creator })
      `;
      const cursor = await db.query(query, { userId });
      return cursor.all();
    } catch (error) {
      console.error('Failed to get user cards:', error);
      return [];
    }
  }

  async updateCard(
    cardId: string,
    userId: string,
    updates: { title?: string; content?: string },
  ): Promise<any> {
    try {
      const db = this.arangoDBService.getDatabase();
      const collection = db.collection('cards');
      
      // 检查卡片是否存在并属于该用户
      const card = await this.getCardById(cardId);
      if (card.createdBy._id !== userId) {
        throw new ForbiddenException('You can only update your own cards');
      }

      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await collection.update(cardId, updateData);
      return this.getCardById(cardId);
    } catch (error) {
      console.error('Failed to update card:', error);
      throw error;
    }
  }

  async deleteCard(cardId: string, userId: string): Promise<boolean> {
    try {
      const db = this.arangoDBService.getDatabase();
      const collection = db.collection('cards');
      
      // 检查卡片是否存在并属于该用户
      const card = await this.getCardById(cardId);
      if (card.createdBy._id !== userId) {
        throw new ForbiddenException('You can only delete your own cards');
      }

      await collection.remove(cardId);
      return true;
    } catch (error) {
      console.error('Failed to delete card:', error);
      throw error;
    }
  }

  async getCardsWithRelations(): Promise<any[]> {
    try {
      const db = this.arangoDBService.getDatabase();
      const query = `
        FOR card IN cards
          LET creator = FIRST(
            FOR user IN users
              FILTER user._id == card.createdBy
              RETURN {
                _id: user._id,
                username: user.username
              }
          )
          LET relations = (
            FOR relation IN CardRelations
              FILTER relation._from == card._id
              FOR relatedCard IN cards
                FILTER relation._to == relatedCard._id
                RETURN relatedCard
          )
          RETURN {
            card: MERGE(card, { createdBy: creator }),
            children: relations
          }
      `;
      const cursor = await db.query(query);
      return cursor.all();
    } catch (error) {
      console.error('Failed to get cards with relations:', error);
      return [];
    }
  }

  async createRelation(fromCardId: string, toCardId: string, userId: string): Promise<void> {
    try {
      const db = this.arangoDBService.getDatabase();
      const edgeCollection = db.collection('CardRelations');

      // 检查两张卡片是否都属于该用户
      const fromCard = await this.getCardById(fromCardId);
      const toCard = await this.getCardById(toCardId);
      
      if (fromCard.createdBy._id !== userId || toCard.createdBy._id !== userId) {
        throw new ForbiddenException('You can only create relations between your own cards');
      }

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
