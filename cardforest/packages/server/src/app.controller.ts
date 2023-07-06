import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ArangoDBService } from './services/arangodb.service';
import { InstallService } from './services/install.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly arangoDBService: ArangoDBService,
    private readonly installService: InstallService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('install')
  async startInstall(): Promise<any> {
    return this.installService.install();
  }

  // @Get('databases')
  // async getDatabases(): Promise<any> {
  //   return this.arangoDBService.createInitialDatabase('aaa');
  // }
}
