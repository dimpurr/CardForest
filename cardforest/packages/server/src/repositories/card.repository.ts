import { Injectable, Logger } from '@nestjs/common';
import { aql } from 'arangojs';
import { BaseRepository } from './base.repository';
import { ArangoDBService } from '../services/arangodb.service';

/**
 * 卡片实体接口
 */
export interface Card {
  _key?: string;
  _id?: string;
  _rev?: string;
  modelId: string;
  title: string;
  content?: string;
  body?: string;
  meta: Record<string, any>;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
}

/**
 * 卡片仓库类
 */
@Injectable()
export class CardRepository extends BaseRepository<Card> {
  private readonly logger = new Logger(CardRepository.name);

  /**
   * 构造函数
   * @param arangoDBService ArangoDB服务
   */
  constructor(private readonly arangoDBService: ArangoDBService) {
    super(arangoDBService.getDatabase(), 'cards');
  }

  /**
   * 获取卡片及其关联数据
   * @param cardId 卡片ID
   * @returns 卡片及其关联数据
   */
  async getCardWithRelations(cardId: string): Promise<any> {
    try {
      const query = aql`
        FOR card IN cards
          FILTER card._key == ${cardId}
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
      const cursor = await this.db.query(query);
      return cursor.hasNext() ? cursor.next() : null;
    } catch (error) {
      this.logger.error('Failed to get card with relations:', error);
      throw error;
    }
  }

  /**
   * 获取所有卡片及其关联数据
   * @returns 卡片及其关联数据数组
   */
  async getAllWithRelations(): Promise<any[]> {
    try {
      const query = aql`
        FOR card IN cards
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
      const cursor = await this.db.query(query);
      return cursor.all();
    } catch (error) {
      this.logger.error('Failed to get all cards with relations:', error);
      throw error;
    }
  }

  /**
   * 获取用户的卡片
   * @param userId 用户ID
   * @returns 用户的卡片数组
   */
  async findByCreator(userId: string): Promise<any[]> {
    try {
      // 处理不同格式的用户ID
      const userRef = userId.startsWith('users/') ? userId : `users/${userId}`;
      
      this.logger.debug('Finding cards by creator:', { userId, userRef });
      
      const query = aql`
        FOR card IN cards
          FILTER card.createdBy == ${userRef} || 
                 (IS_OBJECT(card.createdBy) && card.createdBy._key == ${userId})
          LET model = FIRST(
            FOR t IN models
              FILTER t._key == card.modelId
              RETURN t
          )
          LET user = FIRST(
            FOR u IN users
              FILTER u._id == ${userRef}
              RETURN {
                _id: u._id,
                _key: u._key,
                username: u.username || u.name || u.email || u._key,
                provider: u.provider,
                providerId: u.providerId
              }
          )
          SORT card.createdAt DESC
          RETURN MERGE(card, { model, createdBy: user })
      `;
      
      const cursor = await this.db.query(query);
      const cards = await cursor.all();
      this.logger.debug('Found cards:', cards.length);
      return cards;
    } catch (error) {
      this.logger.error('Failed to find cards by creator:', error);
      throw error;
    }
  }

  /**
   * 创建卡片关系
   * @param fromCardId 源卡片ID
   * @param toCardId 目标卡片ID
   * @returns 是否成功创建
   */
  async createRelation(fromCardId: string, toCardId: string): Promise<boolean> {
    try {
      const fromCardRef = fromCardId.startsWith('cards/') ? fromCardId : `cards/${fromCardId}`;
      const toCardRef = toCardId.startsWith('cards/') ? toCardId : `cards/${toCardId}`;
      
      const edgeCollection = this.db.collection('CardRelations');
      await edgeCollection.save({
        _from: fromCardRef,
        _to: toCardRef,
        createdAt: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      this.logger.error('Failed to create card relation:', error);
      throw error;
    }
  }

  /**
   * 获取卡片及其子卡片
   * @returns 卡片及其子卡片数组
   */
  async getCardsWithChildren(): Promise<any[]> {
    try {
      const query = aql`
        FOR card IN cards
          LET model = FIRST(
            FOR t IN models
              FILTER t._key == card.modelId
              RETURN t
          )
          LET creator = FIRST(
            FOR user IN users
              FILTER user._id == card.createdBy
              RETURN {
                _id: user._id,
                _key: user._key,
                username: user.username || user.name || user.email || user._key
              }
          )
          LET children = (
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
                model: model
              }
            ),
            children: children
          }
      `;
      const cursor = await this.db.query(query);
      return cursor.all();
    } catch (error) {
      this.logger.error('Failed to get cards with children:', error);
      throw error;
    }
  }
}
