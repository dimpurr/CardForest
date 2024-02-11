import { Controller, Get } from '@nestjs/common';
import { CardService } from '../services/card.service';

@Controller('/card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get()
  async getCards(): Promise<any[]> {
    const cards = await this.cardService.getCards();
    return cards;
  }

  // 新增路由处理函数
  @Get('full')
  async getCardsWithRelations(): Promise<any[]> {
    const cards = await this.cardService.getCardsWithRelations();
    return cards;
  }
}
