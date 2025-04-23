import { Injectable } from '@nestjs/common';
import { aql } from 'arangojs';
import { BaseRepository } from './base.repository';
import { ArangoDBService } from '../services/arangodb.service';
import { Card as CardInterface, CardRelation, CreateCardRelationInput } from '../interfaces/card.interface';
export type Card = CardInterface;
import { UserUtils } from '../utils/user.utils';

/**
 * 卡片仓库类
 */
@Injectable()
export class CardRepository extends BaseRepository<Card> {
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
  async getCardWithRelations(cardId: string): Promise<Card | null> {
    try {
      this.logger.debug(`Getting card with relations: ${cardId}`);

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
              FILTER u._id == card.createdBy ||
                     (IS_OBJECT(card.createdBy) && card.createdBy._id == u._id) ||
                     (IS_OBJECT(card.createdBy) && card.createdBy._key == u._key) ||
                     (IS_OBJECT(card.createdBy) && card.createdBy.username == u.username)
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

      const cursor = await this.db.query<Card>(query);
      const hasNext = await cursor.hasNext;
      const result = hasNext ? await cursor.next() : null;

      this.logger.debug(`Card found: ${result ? 'yes' : 'no'}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to get card with relations: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 获取所有卡片及其关联数据
   * @returns 卡片及其关联数据数组
   */
  async getAllWithRelations(): Promise<Card[]> {
    try {
      this.logger.debug('Getting all cards with relations');

      const query = aql`
        FOR card IN cards
          LET model = FIRST(
            FOR t IN models
              FILTER t._key == card.modelId
              RETURN t
          )
          LET user = FIRST(
            FOR u IN users
              FILTER u._id == card.createdBy ||
                     (IS_OBJECT(card.createdBy) && card.createdBy._id == u._id) ||
                     (IS_OBJECT(card.createdBy) && card.createdBy._key == u._key) ||
                     (IS_OBJECT(card.createdBy) && card.createdBy.username == u.username)
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

      const cursor = await this.db.query<Card>(query);
      const results = await cursor.all();

      this.logger.debug(`Found ${results.length} cards`);
      return results;
    } catch (error) {
      this.logger.error(`Failed to get all cards with relations: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 获取用户的卡片
   * @param userId 用户ID
   * @returns 用户的卡片数组
   */
  async findByCreator(userId: string): Promise<Card[]> {
    try {
      // 使用 UserUtils 创建标准用户引用
      const userRef = UserUtils.createUserReference({ _key: userId });

      this.logger.debug(`Finding cards by creator: ${userId}`, { userRef });

      const query = aql`
        FOR card IN cards
          FILTER card.createdBy == ${userRef} ||
                 (IS_OBJECT(card.createdBy) && card.createdBy._key == ${userId}) ||
                 (IS_OBJECT(card.createdBy) && card.createdBy.username == ${userId})
          LET model = FIRST(
            FOR t IN models
              FILTER t._key == card.modelId
              RETURN t
          )
          LET user = FIRST(
            FOR u IN users
              FILTER u._id == ${userRef} || u._key == ${userId}
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

      const cursor = await this.db.query<Card>(query);
      const cards = await cursor.all();

      this.logger.debug(`Found ${cards.length} cards for user ${userId}`);
      return cards;
    } catch (error) {
      this.logger.error(`Failed to find cards by creator: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 创建卡片关系
   * @param input 卡片关系输入
   * @param createdBy 创建者
   * @returns 创建的卡片关系
   */
  async createRelation(input: CreateCardRelationInput, createdBy: string): Promise<CardRelation> {
    try {
      this.logger.debug(`Creating card relation from ${input.fromId} to ${input.toId}`);

      // 构建卡片引用
      const fromCardRef = input.fromId.startsWith('cards/') ? input.fromId : `cards/${input.fromId}`;
      const toCardRef = input.toId.startsWith('cards/') ? input.toId : `cards/${input.toId}`;

      // 构建用户引用
      const userRef = UserUtils.createUserReference({ _key: createdBy });

      // 构建关系数据
      const now = new Date().toISOString();
      const relationData = {
        _from: fromCardRef,
        _to: toCardRef,
        type: input.type,
        meta: input.meta || {},
        createdBy: userRef,
        createdAt: now,
        updatedAt: now
      };

      // 保存关系
      const edgeCollection = this.db.collection('CardRelations');
      const result = await edgeCollection.save(relationData);

      this.logger.debug(`Created card relation with id: ${result._key}`);
      return {
        ...relationData,
        _id: result._id,
        _key: result._key,
        _rev: result._rev,
        fromId: input.fromId,
        toId: input.toId
      } as CardRelation;
    } catch (error) {
      this.logger.error(`Failed to create card relation: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 获取卡片及其子卡片
   * @returns 卡片及其子卡片数组
   */
  async getCardsWithChildren(): Promise<{ card: Card; children: Card[] }[]> {
    try {
      this.logger.debug('Getting cards with children');

      const query = aql`
        FOR card IN cards
          LET model = FIRST(
            FOR t IN models
              FILTER t._key == card.modelId
              RETURN t
          )
          LET creator = FIRST(
            FOR user IN users
              FILTER user._id == card.createdBy ||
                     (IS_OBJECT(card.createdBy) && card.createdBy._id == user._id) ||
                     (IS_OBJECT(card.createdBy) && card.createdBy._key == user._key) ||
                     (IS_OBJECT(card.createdBy) && card.createdBy.username == user.username)
              RETURN {
                _id: user._id,
                _key: user._key,
                username: user.username || user.name || user.email || user._key,
                provider: user.provider,
                providerId: user.providerId
              }
          )
          LET children = (
            FOR relation IN CardRelations
              FILTER relation._from == card._id
              FOR relatedCard IN cards
                FILTER relation._to == relatedCard._id
                LET childCreator = FIRST(
                  FOR childUser IN users
                    FILTER childUser._id == relatedCard.createdBy ||
                           (IS_OBJECT(relatedCard.createdBy) && relatedCard.createdBy._id == childUser._id) ||
                           (IS_OBJECT(relatedCard.createdBy) && relatedCard.createdBy._key == childUser._key) ||
                           (IS_OBJECT(relatedCard.createdBy) && relatedCard.createdBy.username == childUser.username)
                    RETURN {
                      _id: childUser._id,
                      _key: childUser._key,
                      username: childUser.username || childUser.name || childUser.email || childUser._key,
                      provider: childUser.provider,
                      providerId: childUser.providerId
                    }
                )
                RETURN MERGE(relatedCard, { createdBy: childCreator })
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

      const cursor = await this.db.query<{ card: Card; children: Card[] }>(query);
      const results = await cursor.all();

      this.logger.debug(`Found ${results.length} cards with children`);
      return results;
    } catch (error) {
      this.logger.error(`Failed to get cards with children: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 获取卡片的关系
   * @param cardId 卡片ID
   * @returns 卡片关系数组
   */
  async getCardRelations(cardId: string): Promise<CardRelation[]> {
    try {
      this.logger.debug(`Getting relations for card: ${cardId}`);

      // 构建卡片引用
      const cardRef = cardId.startsWith('cards/') ? cardId : `cards/${cardId}`;

      const query = aql`
        FOR relation IN CardRelations
          FILTER relation._from == ${cardRef} || relation._to == ${cardRef}
          LET fromCard = FIRST(
            FOR c IN cards
              FILTER c._id == relation._from
              RETURN c
          )
          LET toCard = FIRST(
            FOR c IN cards
              FILTER c._id == relation._to
              RETURN c
          )
          LET creator = FIRST(
            FOR u IN users
              FILTER u._id == relation.createdBy ||
                     (IS_OBJECT(relation.createdBy) && relation.createdBy._id == u._id) ||
                     (IS_OBJECT(relation.createdBy) && relation.createdBy._key == u._key) ||
                     (IS_OBJECT(relation.createdBy) && relation.createdBy.username == u.username)
              RETURN {
                _id: u._id,
                _key: u._key,
                username: u.username || u.name || u.email || u._key,
                provider: u.provider,
                providerId: u.providerId
              }
          )
          RETURN MERGE(relation, {
            fromCard: {
              _id: fromCard._id,
              _key: fromCard._key,
              title: fromCard.title
            },
            toCard: {
              _id: toCard._id,
              _key: toCard._key,
              title: toCard.title
            },
            createdBy: creator
          })
      `;

      const cursor = await this.db.query<CardRelation>(query);
      const results = await cursor.all();

      this.logger.debug(`Found ${results.length} relations for card ${cardId}`);
      return results;
    } catch (error) {
      this.logger.error(`Failed to get card relations: ${error.message}`, error.stack);
      throw error;
    }
  }
}
