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
      const cardsCollection = db.collection('cards');
      const usersCollection = db.collection('users');

      // 确保用户存在
      const userRef = `${usersCollection.name}/${userId}`;
      const user = await db.query(`
        FOR user IN users
        FILTER user._key == @userId
        RETURN user
      `, { userId }).then(cursor => cursor.next());

      if (!user) {
        throw new Error('User not found');
      }

      const now = new Date().toISOString();
      const card = await cardsCollection.save({
        title,
        content,
        createdBy: userRef,  // 使用完整的文档引用
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
                username: user.username
              }
          )
          RETURN MERGE(
            UNSET(card, ['createdBy']),
            { createdBy: creator }
          )
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
                username: user.username
              }
          )
          RETURN MERGE(
            UNSET(card, ['createdBy']),
            { createdBy: creator }
          )
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
      const usersCollection = db.collection('users');
      const userRef = `${usersCollection.name}/${userId}`;
      
      const query = `
        FOR card IN cards
          FILTER card.createdBy == @userRef
          LET creator = FIRST(
            FOR user IN users
              FILTER user._id == card.createdBy
              RETURN {
                username: user.username
              }
          )
          RETURN MERGE(
            UNSET(card, ['createdBy']),
            { createdBy: creator }
          )
      `;
      const cursor = await db.query(query, { userRef });
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
      if (card.createdBy.username !== userId) {
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
      if (card.createdBy.username !== userId) {
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
            card: MERGE(
              UNSET(card, ['createdBy']),
              { createdBy: creator }
            ),
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
      
      if (fromCard.createdBy.username !== userId || toCard.createdBy.username !== userId) {
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
