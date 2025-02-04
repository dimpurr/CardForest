import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ArangoDBService } from './arangodb.service';
import { DocumentMetadata } from 'arangojs/documents';
import * as bcrypt from 'bcrypt';

interface UserData {
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

type User = UserData & DocumentMetadata;

@Injectable()
export class AuthService {
  constructor(
    private readonly arangoDBService: ArangoDBService,
    private readonly jwtService: JwtService,
  ) {}

  // 私有方法，用于生成含有过期时间的JWT令牌
  private generateToken(payload: any): string {
    return this.jwtService.sign(payload, { expiresIn: '24h' });
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.arangoDBService.getDatabase().query(`
      FOR user IN users
        FILTER user.username == @username
        RETURN user
    `, { username }).then(cursor => cursor.next());

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._key };
    return {
      access_token: this.generateToken(payload), // 使用私有方法生成令牌
    };
  }

  async validateOAuthLogin(data: {
    provider: string;
    providerId: string;
    profile: {
      sub?: string;  // Auth.js GitHub provider 使用 sub
      id?: string;   // 向后兼容
      login: string;
      email: string;
    };
    accessToken: string;
  }): Promise<string> {
    const { provider, providerId, profile, accessToken } = data;
    
    if (!profile || !profile.login) {
      throw new UnauthorizedException('Invalid OAuth profile');
    }

    try {
      // 查找或创建用户
      const user = await this.arangoDBService.getDatabase().query(`
        UPSERT { provider: @provider, providerId: @providerId }
        INSERT { 
          provider: @provider,
          providerId: @providerId,
          username: @username,
          email: @email,
          createdAt: DATE_ISO8601(DATE_NOW()),
          updatedAt: DATE_ISO8601(DATE_NOW())
        }
        UPDATE { 
          username: @username,
          email: @email,
          updatedAt: DATE_ISO8601(DATE_NOW())
        }
        IN users
        RETURN NEW
      `, {
        provider,
        providerId: providerId || profile.sub || profile.id, // 优先使用传入的 providerId，然后是 sub，最后是 id
        username: profile.login,
        email: profile.email
      }).then(cursor => cursor.next());

      if (!user) {
        throw new Error('Failed to create/update user');
      }

      // 生成 JWT
      const payload = {
        sub: user._key,
        provider,
        providerId,
        username: profile.login,
      };

      return this.generateToken(payload);
    } catch (error) {
      console.error('OAuth validation error:', error);
      throw new UnauthorizedException('Failed to validate OAuth login');
    }
  }

  async validateUserByUsername(username: string): Promise<any> {
    const db = this.arangoDBService.getDatabase();
    const query = `
      FOR user IN users
        FILTER user.username == @username
        RETURN user
    `;
    const cursor = await db.query(query, { username });
    const user = await cursor.next();
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async loginByUsername(credentials: { username: string; password: string }): Promise<string> {
    const db = this.arangoDBService.getDatabase();
    const query = `
      FOR user IN users
        FILTER user.username == @username
        RETURN user
    `;
    const cursor = await db.query(query, { username: credentials.username });
    const user = await cursor.next() as User;

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._key, username: user.username };
    return this.jwtService.sign(payload);
  }

  async registerByUsername(username: string, password: string): Promise<any> {
    const db = this.arangoDBService.getDatabase();
    
    // 检查用户名是否已存在
    const existingUser = await db.query(`
      FOR user IN users
        FILTER user.username == @username
        RETURN user
    `, { username }).then(cursor => cursor.next());

    if (existingUser) {
      throw new UnauthorizedException('Username already exists');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const collection = db.collection('users');
    const now = new Date().toISOString();
    const userData: UserData = {
      username,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    };
    
    const result = await collection.save(userData);
    const user = { ...userData, ...result };

    return {
      _key: user._key,
      _id: user._id,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async getUserById(userId: string): Promise<any> {
    const db = this.arangoDBService.getDatabase();
    const query = `
      FOR user IN users
        FILTER user._key == @userId
        RETURN UNSET(user, ['password'])
    `;
    const cursor = await db.query(query, { userId });
    const user = await cursor.next() as User;
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
