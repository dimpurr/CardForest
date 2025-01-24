import { Injectable } from '@nestjs/common';
import { ArangoDBService } from './arangodb.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly arangoDBService: ArangoDBService) {}

  async createUser(username: string, password: string): Promise<any> {
    try {
      const db = this.arangoDBService.getDatabase();
      const collection = db.collection('users');

      const user = await collection.save({
        username,
        password, // 直接保存传入的 password，因为在 auth.service 中已经做了 hash
      });

      return user;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
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

  async findUserByUsername(username: string): Promise<any> {
    try {
      const db = this.arangoDBService.getDatabase();
      const collection = db.collection('users');
      const cursor = await db.query({
        query: `
        FOR user IN @@collection
        FILTER user.username == @username
        RETURN user
      `,
        bindVars: {
          '@collection': collection.name,
          username,
        },
      });
      const [user] = await cursor.all();
      return user;
    } catch (error) {
      console.error('Failed to find user by username:', error);
      return null;
    }
  }

  async getUserById(userId: string): Promise<any> {
    try {
      const db = this.arangoDBService.getDatabase();
      const collection = db.collection('users');
      const user = await collection.document(userId);
      return user;
    } catch (error) {
      console.error('Failed to get user by id:', error);
      return null;
    }
  }
}
