import { Controller, Get } from '@nestjs/common';
import { CardService } from '../services/card.service';

@Controller('/card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get()
  async install(): Promise<string> {
    await this.cardService.getCards();
    return 'get completed';
  }
}
