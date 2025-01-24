import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { CardService } from './card.service';
import { ArangoDBService } from './arangodb.service';
import { TemplateService } from './template.service';
import { Database } from 'arangojs';
import * as bcrypt from 'bcrypt';
import { FieldGroup } from '../interfaces/template.interface';

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
    console.log('Creating base templates...');

    // Create basic template
    const basicTemplateFields: FieldGroup[] = [
      {
        _inherit_from: '_self',
        fields: [
          {
            name: 'title',
            type: 'text',
            required: true,
            config: {
              maxLength: 200,
            },
          },
          {
            name: 'body',
            type: 'text',
            required: false,
            config: {
              multiline: true,
            },
          },
          {
            name: 'content',
            type: 'richtext',
            required: false,
          },
        ],
      },
    ];

    const basicTemplate = await this.templateService.createTemplate(
      {
        name: 'basic',
        fields: basicTemplateFields,
        inherits_from: []
      },
      { sub: 'system' }
    );
    this.basicTemplateKey = basicTemplate._key;
    console.log('Created basic template:', basicTemplate._key);

    // Create date template
    const dateTemplateFields: FieldGroup[] = [
      {
        _inherit_from: this.basicTemplateKey,
        fields: [
          {
            name: 'date',
            type: 'date',
            required: true,
          },
          {
            name: 'reminder',
            type: 'boolean',
            required: false,
            default: false,
          },
          {
            name: 'priority',
            type: 'select',
            required: false,
            config: {
              options: ['low', 'medium', 'high'],
            },
            default: 'medium',
          },
        ],
      },
    ];

    const dateTemplate = await this.templateService.createTemplate(
      {
        name: 'datecard',
        fields: dateTemplateFields,
        inherits_from: [this.basicTemplateKey]
      },
      { sub: 'system' }
    );
    this.dateTemplateKey = dateTemplate._key;
    console.log('Created date template:', dateTemplate._key);

    console.log('Base templates created successfully');
  }

  private async createTestData() {
    try {
      console.log('Creating test data...');
      console.log('Using basic template key:', this.basicTemplateKey);
      console.log('Using date template key:', this.dateTemplateKey);

      // Create test user
      const hashedPassword = await bcrypt.hash('test', 10);
      const testUser = await this.userService.createUser('test', hashedPassword);
      console.log('Created test user:', JSON.stringify(testUser, null, 2));

      // Create test card with basic template
      const basicCardData = {
        templateId: this.basicTemplateKey,
        title: 'Test Basic Card',
        body: 'This is a test card',
        content: '<p>This is a rich text content</p>',
        meta: {},
      };
      console.log('Creating test card with data:', JSON.stringify(basicCardData, null, 2));
      await this.cardService.createCard(basicCardData, testUser);

      // Create test card with date template
      const dateCardData = {
        templateId: this.dateTemplateKey,
        title: 'Test Date Card',
        body: 'This is a test card with date fields',
        content: '<p>This is a rich text content for date card</p>',
        meta: {
          date: new Date().toISOString(),
          reminder: true,
          priority: 'high',
        },
      };
      console.log('Creating test date card with data:', JSON.stringify(dateCardData, null, 2));
      await this.cardService.createCard(dateCardData, testUser);

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
        templateId: this.basicTemplateKey,
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
        templateId: this.basicTemplateKey,
        title: 'Getting Started',
        content: '<p>Learn how to use CardForest</p>',
        body: 'Start here to learn the basics of CardForest.',
        meta: {},
      },
      {
        templateId: this.basicTemplateKey,
        title: 'Templates',
        content: '<p>Create your own templates</p>',
        body: 'Templates help you organize your cards consistently.',
        meta: {},
      },
      {
        templateId: this.basicTemplateKey,
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
