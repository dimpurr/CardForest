import { Injectable } from '@nestjs/common';
import { ArangoDBService } from './arangodb.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly arangoDBService: ArangoDBService) {}

  async createUser(username: string, password: string): Promise<void> {
    try {
      const db = this.arangoDBService.getDatabase();
      const collection = db.collection('users');
      const hashedPassword = await bcrypt.hash(password, 10); // 使用 salt rounds 10

      await collection.save({
        username,
        hashedPassword,
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
          username: username,
        },
      });
      return await cursor.next(); // 假设用户名是唯一的
    } catch (error) {
      console.error('Failed to find user:', error);
      return null;
    }
  }
}
