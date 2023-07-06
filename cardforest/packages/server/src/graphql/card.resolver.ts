import { Resolver, Query } from '@nestjs/graphql';
import { CardService } from '../services/card.service';

@Resolver('Card')
export class CardResolver {
  constructor(private readonly cardService: CardService) {}

  @Query()
  async cards() {
    return this.cardService.getCards();
  }
}
