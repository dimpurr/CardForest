import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ArangoDBService } from './services/arangodb.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly arangoDBService: ArangoDBService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('databases')
  async getDatabases(): Promise<any> {
    return this.arangoDBService.createInitialDatabase('aaa');
  }
}
