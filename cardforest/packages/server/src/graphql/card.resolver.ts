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
  async getMyCards(@CurrentUser() userId: string) {
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
    @CurrentUser() userId: string,
  ) {
    return this.cardService.createCard(input, userId);
  }

  @Mutation('updateCard')
  @UseGuards(AuthGuard)
  async updateCard(
    @Args('id') id: string,
    @Args('input') input: any,
    @CurrentUser() userId: string,
  ) {
    return this.cardService.updateCard(id, userId, input);
  }

  @Mutation('deleteCard')
  @UseGuards(AuthGuard)
  async deleteCard(
    @Args('id') id: string,
    @CurrentUser() userId: string,
  ) {
    return this.cardService.deleteCard(id, userId);
  }

  @Mutation('createRelation')
  @UseGuards(AuthGuard)
  async createRelation(
    @Args('fromCardId') fromCardId: string,
    @Args('toCardId') toCardId: string,
    @CurrentUser() userId: string,
  ) {
    await this.cardService.createRelation(fromCardId, toCardId, userId);
    return true;
  }
}
