import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { CardService } from '../services/card.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Resolver('Card')
export class CardResolver {
  constructor(private readonly cardService: CardService) {}

  @Query()
  async cards() {
    return this.cardService.getCards();
  }

  @Query()
  async card(@Args('id') id: string) {
    return this.cardService.getCardById(id);
  }

  @Query()
  @UseGuards(JwtAuthGuard)
  async myCards(@Context() context) {
    const user = context.req.user;
    if (!user || !user._key) {
      throw new Error('User not authenticated');
    }
    return this.cardService.getCardsByUserId(user._key);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard)
  async createCard(
    @Args('input') input: { title: string; content: string },
    @Context() context,
  ) {
    const user = context.req.user;
    if (!user || !user._key) {
      throw new Error('User not authenticated');
    }
    return this.cardService.createCard(
      input.title,
      input.content,
      user._key,
    );
  }

  @Mutation()
  @UseGuards(JwtAuthGuard)
  async updateCard(
    @Args('id') id: string,
    @Args('input') input: { title?: string; content?: string },
    @Context() context,
  ) {
    return this.cardService.updateCard(
      id,
      context.req.user.userId,
      input,
    );
  }

  @Mutation()
  @UseGuards(JwtAuthGuard)
  async deleteCard(
    @Args('id') id: string,
    @Context() context,
  ) {
    return this.cardService.deleteCard(id, context.req.user.userId);
  }
}
