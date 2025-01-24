import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { CardService } from './card.service';
import { ArangoDBService } from './arangodb.service';
import { TemplateService } from './template.service';
import { Database } from 'arangojs';
import * as bcrypt from 'bcrypt';

// NOTE: This service is only used for the initial installation of the database.

@Injectable()
export class InstallService {
  private db: Database;
  private basicTemplateKey: string;
  private dateTemplateKey: string;

  constructor(
    private readonly userService: UserService,
    private readonly cardService: CardService,
    private readonly arangoDBService: ArangoDBService,
    private readonly templateService: TemplateService,
  ) {
    this.db = this.arangoDBService.getDatabase();
  }

  async install(): Promise<void> {
    console.log('Installing...');

    // 清空数据库
    await this.arangoDBService.clearDatabase();
    console.log('Cleared database:', this.db.name);

    // 创建集合
    await this.createCollections();

    // 创建基础模板
    await this.createBaseTemplates();

    // 创建测试数据
    await this.createTestData();

    // 创建管理员用户
    const adminUser = await this.createAdminUser();

    // 创建默认卡片
    await this.createDefaultCards(adminUser._key);

    console.log('Installation complete');
  }

  private async createCollections() {
    // 用户集合
    const users = this.db.collection('users');
    if (!(await users.exists())) {
      await users.create();
      console.log('Created users collection');
    }

    // 卡片集合
    const cards = this.db.collection('cards');
    if (!(await cards.exists())) {
      await cards.create();
      console.log('Created cards collection');
    }

    // 模板集合
    const templates = this.db.collection('templates');
    if (!(await templates.exists())) {
      await templates.create();
      console.log('Created templates collection');
    }

    // 关系集合
    const relations = this.db.collection('CardRelations');
    if (!(await relations.exists())) {
      await relations.create({ type: 3 }); // type: 3 表示边集合
      console.log('Created relations collection');
    }
  }

  private async createBaseTemplates() {
    try {
      console.log('Creating base templates...');
      
      // Define basic template fields
      const basicTemplateFields = {
        title: {
          type: 'text',
          required: true,
          config: {
            maxLength: 200,
          },
        },
        body: {
          type: 'text',
          required: false,
          config: {
            multiline: true,
          },
        },
        content: {
          type: 'richtext',
          required: false,
        },
      };
      
      console.log('Basic template fields:', JSON.stringify(basicTemplateFields, null, 2));

      // 创建基础模板
      const basicTemplate = await this.templateService.createTemplate(
        'basic',
        basicTemplateFields,
        undefined, // 不继承自任何模板
        undefined, // 系统创建
      );
      console.log('Created basic template:', JSON.stringify(basicTemplate, null, 2));
      this.basicTemplateKey = basicTemplate._key;

      // Define date template fields
      const dateTemplateFields = {
        title: {
          type: 'text',
          required: true,
          config: {
            maxLength: 200,
          },
        },
        date: {
          type: 'date',
          required: true,
        },
        reminder: {
          type: 'boolean',
          required: false,
          default: false,
        },
        priority: {
          type: 'text',
          required: false,
          options: ['low', 'medium', 'high'],
          default: 'medium',
        },
      };

      console.log('Date template fields:', JSON.stringify(dateTemplateFields, null, 2));

      // 创建日期卡片模板
      const dateTemplate = await this.templateService.createTemplate(
        'datecard',
        dateTemplateFields,
        undefined,
        undefined,
      );
      console.log('Created date template:', JSON.stringify(dateTemplate, null, 2));
      this.dateTemplateKey = dateTemplate._key;

    } catch (error) {
      console.error('Failed to create base templates:', error);
      throw error;
    }
  }

  private async createTestData() {
    try {
      console.log('Creating test data...');
      console.log('Using basic template key:', this.basicTemplateKey);
      console.log('Using date template key:', this.dateTemplateKey);

      // Create test user
      const usersCollection = this.db.collection('users');
      const user = await usersCollection.save({
        username: 'test',
        password: 'test',
      });
      console.log('Created test user:', JSON.stringify(user, null, 2));

      // Prepare test card data
      const testCardData = {
        template: this.basicTemplateKey,
        title: 'Test Card',
        body: 'This is a test card',
        content: '<p>This is a rich text content</p>',
        meta: {},
      };
      console.log('Creating test card with data:', JSON.stringify(testCardData, null, 2));

      // Create test card
      const testCard = await this.cardService.createCard(
        testCardData,
        user._key
      );
      console.log('Created test card:', JSON.stringify(testCard, null, 2));

      // Prepare test date card data
      const testDateCardData = {
        template: this.dateTemplateKey,
        title: 'Test Date Card',
        body: 'This is a test date card',
        content: '<p>This is a date card content</p>',
        meta: {
          date: new Date().toISOString(),
          reminder: true,
          priority: 'high',
        },
      };
      console.log('Creating test date card with data:', JSON.stringify(testDateCardData, null, 2));

      // Create test date card
      const testDateCard = await this.cardService.createCard(
        testDateCardData,
        user._key
      );
      console.log('Created test date card:', JSON.stringify(testDateCard, null, 2));

    } catch (error) {
      console.error('Failed to create test data:', error);
      throw error;
    }
  }

  private async createAdminUser() {
    try {
      const usersCollection = this.db.collection('users');
      const adminUser = await usersCollection.save({
        username: 'admin',
        password: await bcrypt.hash('admin', 10),
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log('Created admin user:', adminUser);
      return adminUser;
    } catch (error) {
      console.error('Failed to create admin user:', error);
      throw error;
    }
  }

  async createDefaultCard(userId: string): Promise<void> {
    await this.cardService.createCard(
      {
        template: this.basicTemplateKey,
        title: 'Welcome to CardForest',
        content: '<p>This is your first card!</p>',
        body: 'Welcome to CardForest. This is your first card.',
        meta: {},
      },
      userId,
    );
  }

  async createDefaultCards(userId: string): Promise<void> {
    const cards = [
      {
        template: this.basicTemplateKey,
        title: 'Getting Started',
        content: '<p>Learn how to use CardForest</p>',
        body: 'This card will help you get started with CardForest.',
        meta: {},
      },
      {
        template: this.basicTemplateKey,
        title: 'Features',
        content: '<p>Explore CardForest features</p>',
        body: 'Discover all the amazing features CardForest has to offer.',
        meta: {},
      },
      {
        template: this.basicTemplateKey,
        title: 'Templates',
        content: '<p>Use templates to organize your cards</p>',
        body: 'Templates help you organize your cards and maintain consistency.',
        meta: {},
      },
      {
        template: this.basicTemplateKey,
        title: 'Relations',
        content: '<p>Connect your cards</p>',
        body: 'Create relations between cards to build a knowledge network.',
        meta: {},
      },
    ];

    for (const card of cards) {
      await this.cardService.createCard(card, userId);
    }
  }
}
