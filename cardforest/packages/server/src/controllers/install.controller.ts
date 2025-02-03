import { Controller, Get, Res } from '@nestjs/common';
import { InstallService } from '../services/install.service';
import { Response } from 'express';

@Controller('install')
export class InstallController {
  constructor(private readonly installService: InstallService) {}

  @Get()
  async install(@Res() res: Response) {
    try {
      console.log('Installing...');
      await this.installService.install();
      res.send(`
        <h3>Installation complete</h3>
        <p>✅ Created basic model and date model</p>
        <p>✅ Created test user and admin user</p>
        <p>✅ Created sample cards</p>
      `);
    } catch (error) {
      console.error('Installation failed:', error);
      res.status(500).send(`
        <h3>Installation failed</h3>
        <p>Error: ${error.message}</p>
      `);
    }
  }
}
