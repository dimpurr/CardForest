import { Injectable } from '@nestjs/common';
import { ArangoDBService } from './arangodb.service';

@Injectable()
export class UserService {
  constructor(private readonly arangoDBService: ArangoDBService) {}

  async createUser(username: string, password: string): Promise<void> {
    try {
      const db = this.arangoDBService.getDatabase();
      const collection = db.collection('users');

      await collection.save({
        username,
        password,
      });
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  }

  async getUsers(): Promise<any[]> {
    try {
      const db = this.arangoDBService.getDatabase();
      const collection = db.collection('users');

      const cursor = await collection.all();
      const users = await cursor.all();
      return users;
    } catch (error) {
      console.error('Failed to get users:', error);
      return [];
    }
  }
}
