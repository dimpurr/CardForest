import { Controller, Get } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { ArangoDBService } from '../services/arangodb.service';
import { InstallService } from '../services/install.service';
import { CardService } from '../services/card.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly arangoDBService: ArangoDBService,
    private readonly installService: InstallService,
    private readonly cardService: CardService,
  ) {}

  @Get()
  getHello(): string {
    // res.set('Content-Type', 'text/html');
    return this.appService.getHello();
  }

  @Get('install')
  async startInstall(): Promise<any> {
    return this.installService.install();
  }

  @Get('card')
  async allCard(): Promise<any> {
    return this.cardService.getCards();
  }

  // @Get('databases')
  // async getDatabases(): Promise<any> {
  //   return this.arangoDBService.createInitialDatabase('aaa');
  // }
}
