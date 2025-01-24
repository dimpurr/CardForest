import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ArangoDBService } from './arangodb.service';
import { TemplateService } from './template.service';
import { Database } from 'arangojs';

interface CreateCardDto {
  template: string;
  title: string;
  content?: string;
  body?: string;
  meta: Record<string, any>;
}

interface UpdateCardDto {
  title?: string;
  content?: string;
  body?: string;
  meta?: Record<string, any>;
}

@Injectable()
export class CardService {
  private db: Database;

  constructor(
    private readonly arangoDBService: ArangoDBService,
    private readonly templateService: TemplateService,
  ) {
    this.db = this.arangoDBService.getDatabase();
  }

  async createCard(
    input: CreateCardDto,
    user: any, // JWT user data
  ): Promise<any> {
    try {
      console.log('Creating card with input:', JSON.stringify(input, null, 2));
      console.log('User data:', user);

      // Validate input fields
      if (!input.template || typeof input.template !== 'string') {
        throw new Error('Invalid card data: template is required and must be a string');
      }
      if (!input.title || typeof input.title !== 'string') {
        throw new Error('Invalid card data: title is required and must be a string');
      }
      if (input.content !== undefined && typeof input.content !== 'string') {
        throw new Error('Invalid card data: content must be a string');
      }
      if (input.body !== undefined && typeof input.body !== 'string') {
        throw new Error('Invalid card data: body must be a string');
      }
      if (!input.meta || typeof input.meta !== 'object') {
        console.log('Meta is missing or invalid, initializing empty object');
        input.meta = {};
      }

      const cardsCollection = this.db.collection('cards');

      // Prepare card data for validation
      const cardData = {
        title: input.title,
        content: input.content,
        body: input.body,
        meta: input.meta,
      };
      console.log('Card data prepared for validation:', JSON.stringify(cardData, null, 2));

      // Validate against template
      await this.templateService.validateCardData(input.template, cardData);

      const now = new Date().toISOString();
      const cardDoc = {
        template: input.template,
        title: input.title,
        content: input.content || '',
        body: input.body || '',
        meta: input.meta || {},
        createdBy: user.sub,
        createdAt: now,
        updatedAt: now,
      };
      
      const card = await cardsCollection.save(cardDoc);
      console.log('Card created successfully:', JSON.stringify(card, null, 2));

      // Return the complete card with all required fields
      return {
        _id: card._id,
        _key: card._key,
        _rev: card._rev,
        ...cardDoc,
        createdBy: {
          username: user.username
        },
      };
    } catch (error) {
      console.error('Failed to create card:', error);
      throw error;
    }
  }

  async getCardById(cardId: string): Promise<any> {
    try {
      const query = `
        FOR card IN cards
          FILTER card._key == @cardId
          LET template = FIRST(
            FOR t IN templates
              FILTER t._key == card.template
              RETURN t
          )
          LET creator = FIRST(
            FOR user IN users
              FILTER user._id == card.createdBy
              RETURN {
                username: user.username
              }
          )
          RETURN MERGE(
            UNSET(card, ['createdBy']),
            { 
              createdBy: creator,
              template: template
            }
          )
      `;
      const cursor = await this.db.query(query, { cardId });
      const card = await cursor.next();
      if (!card) {
        throw new NotFoundException('Card not found');
      }
      return card;
    } catch (error) {
      console.error('Failed to get card:', error);
      throw error;
    }
  }

  async getCards(): Promise<any[]> {
    try {
      const query = `
        FOR card IN cards
          LET template = FIRST(
            FOR t IN templates
              FILTER t._key == card.template
              RETURN t
          )
          LET creator = FIRST(
            FOR user IN users
              FILTER user._id == card.createdBy
              RETURN {
                username: user.username
              }
          )
          RETURN MERGE(
            UNSET(card, ['createdBy']),
            { 
              createdBy: creator,
              template: template
            }
          )
      `;
      const cursor = await this.db.query(query);
      return cursor.all();
    } catch (error) {
      console.error('Failed to get cards:', error);
      return [];
    }
  }

  async getCardsByUserId(userId: string): Promise<any[]> {
    try {
      const usersCollection = this.db.collection('users');
      const userRef = `${usersCollection.name}/${userId}`;
      
      const query = `
        FOR card IN cards
          FILTER card.createdBy == @userRef
          LET template = FIRST(
            FOR t IN templates
              FILTER t._key == card.template
              RETURN t
          )
          LET creator = FIRST(
            FOR user IN users
              FILTER user._id == card.createdBy
              RETURN {
                username: user.username
              }
          )
          RETURN MERGE(
            UNSET(card, ['createdBy']),
            { 
              createdBy: creator,
              template: template
            }
          )
      `;
      const cursor = await this.db.query(query, { userRef });
      return cursor.all();
    } catch (error) {
      console.error('Failed to get user cards:', error);
      return [];
    }
  }

  async updateCard(
    cardId: string,
    userId: string,
    updates: UpdateCardDto,
  ): Promise<any> {
    try {
      const collection = this.db.collection('cards');
      
      // 获取卡片和模板信息
      const card = await this.getCardById(cardId);
      if (card.createdBy.username !== userId) {
        throw new ForbiddenException('You can only update your own cards');
      }

      // 验证更新数据
      if (updates.meta) {
        console.log('Card data before validation:', {
          template: card.template._key,
          title: card.title,
          content: card.content,
          body: card.body,
          meta: {
            ...card.meta,
            ...updates.meta,
          },
        });
        await this.templateService.validateCardData(card.template._key, {
          ...card,
          meta: {
            ...card.meta,
            ...updates.meta,
          },
        });
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
      const collection = this.db.collection('cards');
      
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
      const query = `
        FOR card IN cards
          LET template = FIRST(
            FOR t IN templates
              FILTER t._key == card.template
              RETURN t
          )
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
              { 
                createdBy: creator,
                template: template
              }
            ),
            children: relations
          }
      `;
      const cursor = await this.db.query(query);
      return cursor.all();
    } catch (error) {
      console.error('Failed to get cards with relations:', error);
      return [];
    }
  }

  async createRelation(fromCardId: string, toCardId: string, userId: string): Promise<void> {
    try {
      const fromCard = await this.getCardById(fromCardId);
      const toCard = await this.getCardById(toCardId);

      if (fromCard.createdBy.username !== userId) {
        throw new ForbiddenException('You can only create relations from your own cards');
      }

      const collection = this.db.collection('CardRelations');
      await collection.save({
        _from: `cards/${fromCardId}`,
        _to: `cards/${toCardId}`,
        createdAt: new Date().toISOString(),
        createdBy: `users/${userId}`,
      });
    } catch (error) {
      console.error('Failed to create relation:', error);
      throw error;
    }
  }
}
