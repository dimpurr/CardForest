import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Database, aql } from 'arangojs';

@Injectable()
export class ArangoDBService {
  private db: Database;

  constructor(private readonly configService: ConfigService) {
    const arangoDBUrl = this.configService.get<string>('ARANGO_DB_URL');
    const arangoDBPassword =
      this.configService.get<string>('ARANGO_DB_PASSWORD');

    console.log('arangoDBUrl', arangoDBUrl);
    console.log('arangoDBPassword', arangoDBPassword);

    this.db = new Database({
      url: arangoDBUrl,
      //   databaseName: 'pancakes',
      auth: {
        username: 'root',
        password: arangoDBPassword,
      },
    });
    this.db.listUserDatabases().then((dbs) => console.log(dbs));
  }

  async createInitialDatabase(databaseName: string): Promise<void> {
    try {
      const exists = await this.databaseExists(databaseName);
      if (!exists) {
        await this.db.createDatabase(databaseName);
        console.log(`Created initial database: ${databaseName}`);
      }
      this.db.listUserDatabases().then((dbs) => console.log(dbs));
    } catch (error) {
      console.error('Failed to create or use initial database:', error);
    }
  }

  private async databaseExists(databaseName: string): Promise<boolean> {
    try {
      const databases = await this.db.listUserDatabases();
      return databases.some((database) => database === databaseName);
    } catch (error) {
      console.error('Failed to check database existence:', error);
      return false;
    }
  }
}
