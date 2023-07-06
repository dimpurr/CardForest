import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Database } from 'arangojs';

@Injectable()
export class ArangoDBService {
  private db: Database;
  private databaseName: string;

  constructor(private readonly configService: ConfigService) {
    const arangoDBUrl = this.configService.get<string>('ARANGO_DB_URL');
    const arangoDBPassword =
      this.configService.get<string>('ARANGO_DB_PASSWORD');
    this.databaseName = this.configService.get<string>('ARANGO_DB_NAME');

    this.db = new Database({
      url: arangoDBUrl,
      auth: {
        username: 'root',
        password: arangoDBPassword,
      },
    });
  }

  async createDatabase(): Promise<void> {
    try {
      const exists = await this.databaseExists();
      if (!exists) {
        await this.db.createDatabase(this.databaseName);
        console.log(`Created database: ${this.databaseName}`);
      }
    } catch (error) {
      console.error('Failed to create or use database:', error);
    }
  }

  private databaseExists = async (): Promise<boolean> => {
    try {
      const databases = await this.db.listUserDatabases();
      return databases.some((database) => database === this.databaseName);
    } catch (error) {
      console.error('Failed to check database existence:', error);
      return false;
    }
  };

  getDatabase(): Database {
    return this.db.database(this.databaseName);
  }
}
