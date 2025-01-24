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
    const userId = typeof user === 'object' ? user.sub : user;
    return this.cardService.getCardsByUserId(userId);
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
    return this.cardService.createCard(input, user);
  }

  @Mutation('updateCard')
  @UseGuards(AuthGuard)
  async updateCard(
    @Args('id') id: string,
    @Args('input') input: any,
    @CurrentUser() user: any,
  ) {
    const userId = typeof user === 'object' ? user.sub : user;
    return this.cardService.updateCard(id, userId, input);
  }

  @Mutation('deleteCard')
  @UseGuards(AuthGuard)
  async deleteCard(
    @Args('id') id: string,
    @CurrentUser() user: any,
  ) {
    const userId = typeof user === 'object' ? user.sub : user;
    return this.cardService.deleteCard(id, userId);
  }

  @Mutation('createCardRelation')
  @UseGuards(AuthGuard)
  async createCardRelation(
    @Args('fromCardId') fromCardId: string,
    @Args('toCardId') toCardId: string,
    @CurrentUser() user: any,
  ) {
    const userId = typeof user === 'object' ? user.sub : user;
    await this.cardService.createRelation(fromCardId, toCardId, userId);
    return true;
  }
}
