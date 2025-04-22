import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CardService } from '../services/card.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@Resolver('Card')
export class CardResolver {
  constructor(private readonly cardService: CardService) {}

  @Query('card')
  async getCard(@Args('id') id: string) {
    return this.cardService.getCardById(id);
  }

  @Query('cards')
  async getCards() {
    return this.cardService.getCards();
  }

  @Query('myCards')
  @UseGuards(AuthGuard)
  async getMyCards(@CurrentUser() user: any) {
    console.log('Getting cards for user:', user);

    // 处理不同格式的用户对象
    let userId: string;

    if (typeof user === 'object') {
      // 如果是对象，尝试从不同属性中获取 ID
      userId = user.sub || user._key || user.id || user._id;
      console.log('Extracted userId from object:', userId);
    } else {
      // 如果是字符串，直接使用
      userId = user;
      console.log('Using userId directly:', userId);
    }

    if (!userId) {
      console.error('Could not determine userId from user object:', user);
      throw new Error('Invalid user ID');
    }

    return this.cardService.getMyCards(userId);
  }

  @Query('cardsWithRelations')
  async getCardsWithRelations() {
    return this.cardService.getCardsWithRelations();
  }

  @Mutation('createCard')
  @UseGuards(AuthGuard)
  async createCard(
    @Args('input') input: any,
    @CurrentUser() user: any,
  ) {
    // 处理不同格式的用户对象
    let userId: string;

    if (typeof user === 'object') {
      // 如果是对象，尝试从不同属性中获取 ID
      userId = user.sub || user._key || user.id || user._id;
      // 创建一个新的用户对象，包含所需的属性
      user = {
        ...user,
        sub: userId,
        username: user.username || user.name || user.login || userId
      };
    }

    if (!userId) {
      throw new Error('Invalid user ID');
    }

    return this.cardService.createCard(input, user);
  }

  @Mutation('updateCard')
  @UseGuards(AuthGuard)
  async updateCard(
    @Args('id') id: string,
    @Args('input') input: any,
    @CurrentUser() user: any,
  ) {
    // 处理不同格式的用户对象
    let userId: string;

    if (typeof user === 'object') {
      // 如果是对象，尝试从不同属性中获取 ID
      userId = user.sub || user._key || user.id || user._id;
    } else {
      // 如果是字符串，直接使用
      userId = user;
    }

    if (!userId) {
      throw new Error('Invalid user ID');
    }

    return this.cardService.updateCard(id, userId, input);
  }

  @Mutation('deleteCard')
  @UseGuards(AuthGuard)
  async deleteCard(
    @Args('id') id: string,
    @CurrentUser() user: any,
  ) {
    // 处理不同格式的用户对象
    let userId: string;

    if (typeof user === 'object') {
      // 如果是对象，尝试从不同属性中获取 ID
      userId = user.sub || user._key || user.id || user._id;
    } else {
      // 如果是字符串，直接使用
      userId = user;
    }

    if (!userId) {
      throw new Error('Invalid user ID');
    }

    return this.cardService.deleteCard(id, userId);
  }

  @Mutation('createCardRelation')
  @UseGuards(AuthGuard)
  async createCardRelation(
    @Args('fromCardId') fromCardId: string,
    @Args('toCardId') toCardId: string,
    @CurrentUser() user: any,
  ) {
    // 处理不同格式的用户对象
    let userId: string;

    if (typeof user === 'object') {
      // 如果是对象，尝试从不同属性中获取 ID
      userId = user.sub || user._key || user.id || user._id;
    } else {
      // 如果是字符串，直接使用
      userId = user;
    }

    if (!userId) {
      throw new Error('Invalid user ID');
    }

    await this.cardService.createRelation(fromCardId, toCardId, userId);
    return true;
  }
}
