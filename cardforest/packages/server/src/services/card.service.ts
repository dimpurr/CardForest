import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { ModelService } from './model.service';
import { CardRepository, Card } from '../repositories/card.repository';

interface CreateCardDto {
  modelId: string;
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
  private readonly logger = new Logger(CardService.name);

  constructor(
    private readonly cardRepository: CardRepository,
    private readonly modelService: ModelService,
  ) {}

  async createCard(
    input: CreateCardDto,
    user: any, // JWT user data
  ): Promise<any> {
    try {
      this.logger.log('Creating card with input:', JSON.stringify(input, null, 2));
      this.logger.log('User data:', user);

      // Validate input fields
      if (!input.modelId || typeof input.modelId !== 'string') {
        throw new Error('Invalid card data: modelId is required and must be a string');
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
        this.logger.log('Meta is missing or invalid, initializing empty object');
        input.meta = {};
      }

      const cardsCollection = this.db.collection('cards');

      // Get model for validation
      const model = await this.modelService.getFullModelById(input.modelId);
      if (!model) {
        throw new Error(`Model ${input.modelId} not found`);
      }

      // Prepare card data for validation
      const cardData = {
        title: input.title,
        content: input.content,
        body: input.body,
        meta: input.meta,
      };
      this.logger.log('Card data prepared for validation:', JSON.stringify(cardData, null, 2));

      // Validate against model
      await this.modelService.validateCardData(model, cardData);

      const now = new Date().toISOString();

      // 处理不同格式的用户对象
      let userId: string;
      if (typeof user === 'object') {
        userId = user.sub || user._key || user.id || user._id;
      } else {
        userId = user;
      }

      if (!userId) {
        throw new Error('Invalid user ID');
      }

      const cardDoc = {
        modelId: input.modelId,
        title: input.title,
        content: input.content || '',
        body: input.body || '',
        meta: input.meta || {},
        createdBy: `users/${userId}`,
        createdAt: now,
        updatedAt: now,
      };

      const card = await cardsCollection.save(cardDoc);
      this.logger.log('Card created successfully:', JSON.stringify(card, null, 2));

      // 处理用户信息
      let username: string;
      let provider: string | undefined;
      let providerId: string | undefined;

      if (typeof user === 'object') {
        username = user.username || user.name || user.login || user.email || userId;
        provider = user.provider;
        providerId = user.providerId;
      } else {
        username = userId;
      }

      // Return the complete card with all required fields
      return {
        _id: card._id,
        _key: card._key,
        _rev: card._rev,
        ...cardDoc,
        createdBy: {
          _id: `users/${userId}`,
          _key: userId,
          username: username,
          provider: provider,
          providerId: providerId
        }
      };
    } catch (error) {
      this.logger.error('Failed to create card:', error);
      throw error;
    }
  }

  async getCardById(cardId: string): Promise<any> {
    try {
      this.logger.log(`Getting card by ID: ${cardId}`);
      const card = await this.cardRepository.getCardWithRelations(cardId);
      if (!card) {
        throw new NotFoundException('Card not found');
      }
      return card;
    } catch (error) {
      this.logger.error(`Failed to get card: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getCards(): Promise<any[]> {
    try {
      this.logger.log('Getting all cards');
      return await this.cardRepository.getAllWithRelations();
    } catch (error) {
      this.logger.error(`Failed to get cards: ${error.message}`, error.stack);
      return [];
    }
  }

  async getCardsByUserId(userId: string): Promise<any[]> {
    try {
      const usersCollection = this.db.collection('users');
      const userRef = `${usersCollection.name}/${userId}`;

      this.logger.log('Getting cards for user:', { userId, userRef });

      const query = `
        FOR card IN cards
          FILTER card.createdBy == @userId
          LET model = FIRST(
            FOR t IN models
              FILTER t._key == card.modelId
              RETURN t
          )
          LET user = FIRST(
            FOR u IN users
              FILTER u._id == card.createdBy
              RETURN {
                _id: u._id,
                _key: u._key,
                username: u.username || u.name || u.email || u._key,
                provider: u.provider,
                providerId: u.providerId
              }
          )
          RETURN MERGE(card, { model, createdBy: user })
      `;

      this.logger.log('Running query with params:', { userId });
      const cursor = await this.db.query(query, { userId });
      const results = await cursor.all();
      this.logger.log('Found cards:', results.length);
      return results;
    } catch (error) {
      this.logger.error('Failed to get user cards:', error);
      throw error;
    }
  }

  async getMyCards(userId: string): Promise<any[]> {
    try {
      this.logger.debug(`Getting cards for user: ${userId}`);
      return await this.cardRepository.findByCreator(userId);
    } catch (error) {
      this.logger.error(`Error getting cards: ${error.message}`, error.stack);
      throw error;
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
        this.logger.log('Card data before validation:', {
          modelId: card.model._key,
          title: card.title,
          content: card.content,
          body: card.body,
          meta: {
            ...card.meta,
            ...updates.meta,
          },
        });
        const model = await this.modelService.getFullModelById(card.model._key);
        if (!model) {
          throw new Error(`Model ${card.model._key} not found`);
        }
        await this.modelService.validateCardData(model, {
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
      this.logger.error('Failed to update card:', error);
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
      this.logger.error('Failed to delete card:', error);
      throw error;
    }
  }

  async getCardsWithRelations(): Promise<any[]> {
    try {
      this.logger.log('Getting cards with relations');
      return await this.cardRepository.getCardsWithChildren();
    } catch (error) {
      this.logger.error(`Failed to get cards with relations: ${error.message}`, error.stack);
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

      await this.cardRepository.createRelation(fromCardId, toCardId);
      this.logger.log(`Created relation from card ${fromCardId} to card ${toCardId}`);
    } catch (error) {
      this.logger.error(`Failed to create relation: ${error.message}`, error.stack);
      throw error;
    }
  }
}
