import { Controller, Get } from '@nestjs/common';
import { InstallService } from '../services/install.service';

@Controller('/install')
export class InstallController {
  constructor(private readonly installService: InstallService) {}

  @Get()
  async install(): Promise<string> {
    await this.installService.install();
    return 'Installation completed';
  }
}
