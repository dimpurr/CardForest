import { Injectable, Logger } from '@nestjs/common';
import { UserRepository, User } from '../repositories/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async createUser(username: string, password: string): Promise<User> {
    try {
      this.logger.log(`Creating user: ${username}`);

      const user = await this.userRepository.create({
        username,
        password, // 直接保存传入的 password，因为在 auth.service 中已经做了 hash
        createdAt: new Date().toISOString(),
      });

      return user;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      this.logger.log('Getting all users');
      return await this.userRepository.findAll();
    } catch (error) {
      this.logger.error(`Failed to get users: ${error.message}`, error.stack);
      return [];
    }
  }

  async findUserByUsername(username: string): Promise<User | null> {
    try {
      this.logger.log(`Finding user by username: ${username}`);
      return await this.userRepository.findByUsername(username);
    } catch (error) {
      this.logger.error(`Failed to find user by username: ${error.message}`, error.stack);
      return null;
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      this.logger.log(`Getting user by ID: ${userId}`);
      return await this.userRepository.findById(userId);
    } catch (error) {
      this.logger.error(`Failed to get user by ID: ${error.message}`, error.stack);
      return null;
    }
  }
}
