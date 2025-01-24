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
      const systemDb = this.db.database('_system');
      const exists = await this.databaseExists();
      if (!exists) {
        await systemDb.createDatabase(this.databaseName);
        console.log(`Created database: ${this.databaseName}`);
      }
      // 创建后切换到新数据库
      this.db = this.db.database(this.databaseName);
    } catch (error) {
      console.error('Failed to create or use database:', error);
      throw error;
    }
  }

  async createCollections(): Promise<void> {
    try {
      // 使用 this.db，它已经指向了正确的数据库
      await this.createCollection('cards');
      await this.createCollection('users');
      console.log('Created collections: cards, users');
    } catch (error) {
      console.error('Failed to create collections:', error);
    }
  }

  async createGraph(): Promise<void> {
    try {
      console.log('Creating graph');
      const graphExists = await this.db.graph('cardGraph').exists();
      if (!graphExists) {
        await this.db.createGraph('cardGraph', [
          {
            collection: 'CardRelations',
            from: ['cards'],
            to: ['cards'],
          },
        ]);
        console.log('Graph created successfully');
      } else {
        console.log('Graph already exists');
      }
    } catch (error) {
      console.error('Failed to create graph:', error);
      throw error; // Re-throw the error if you want the caller to handle it
    }
  }

  async createEdgeCollections(): Promise<void> {
    try {
      console.log('Creating edge collections');
      const collectionExists = await this.db
        .collection('CardRelations')
        .exists();
      if (!collectionExists) {
        await this.db.collection('CardRelations').create({ type: 3 }); // 3 表示边集合
        console.log('Edge collection created successfully');
      } else {
        console.log('Edge collection already exists');
      }
    } catch (error) {
      console.error('Failed to create edge collections:', error);
      throw error; // Re-throw the error if you want the caller to handle it
    }
  }

  async clearDatabase(): Promise<void> {
    try {
      const db = this.db.database(this.databaseName);
      const collections = await db.collections();
      for (const collection of collections) {
        await collection.truncate();
      }
      console.log(`Cleared database: ${this.databaseName}`);
    } catch (error) {
      console.error('Failed to clear database:', error);
    }
  }

  getDatabase(): Database {
    return this.db.database(this.databaseName);
  }

  private async databaseExists(): Promise<boolean> {
    try {
      const systemDb = this.db.database('_system');
      const databases = await systemDb.listDatabases();
      return databases.includes(this.databaseName);
    } catch (error) {
      console.error('Failed to check database existence:', error);
      return false;
    }
  }

  private async createCollection(collectionName: string): Promise<void> {
    const collection = this.db.collection(collectionName);
    const exists = await collection.exists();
    if (!exists) {
      await collection.create();
    }
  }
}
