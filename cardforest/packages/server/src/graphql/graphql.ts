
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface FieldDefinitionInput {
    name: string;
    type: string;
    required?: Nullable<boolean>;
    default?: Nullable<JSON>;
    config?: Nullable<JSON>;
}

export interface FieldGroupInput {
    _inherit_from: string;
    fields: FieldDefinitionInput[];
}

export interface CreateTemplateInput {
    name: string;
    inherits_from?: Nullable<string[]>;
    fields: FieldGroupInput[];
}

export interface UpdateTemplateInput {
    name?: Nullable<string>;
    inherits_from?: Nullable<string[]>;
    fields?: Nullable<FieldGroupInput[]>;
}

export interface User {
    _key: string;
    _id: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface FieldDefinition {
    name: string;
    type: string;
    required?: Nullable<boolean>;
    default?: Nullable<JSON>;
    config?: Nullable<JSON>;
}

export interface FieldGroup {
    _inherit_from: string;
    fields: FieldDefinition[];
}

export interface Template {
    _key: string;
    _id: string;
    name: string;
    inherits_from: string[];
    fields: FieldGroup[];
    system: boolean;
    createdAt: string;
    updatedAt?: Nullable<string>;
    createdBy?: Nullable<string>;
}

export interface FlattenedTemplate {
    _key: string;
    _id: string;
    name: string;
    fields: JSON;
    system: boolean;
    createdAt: string;
    updatedAt?: Nullable<string>;
    createdBy?: Nullable<string>;
}

export interface Card {
    _key: string;
    _id: string;
    template: Template;
    title: string;
    content?: Nullable<string>;
    body?: Nullable<string>;
    meta: JSON;
    createdAt: Date;
    updatedAt: Date;
    createdBy: User;
}

export interface CardWithRelations {
    card: Card;
    children: Card[];
}

export interface IQuery {
    me(): Nullable<User> | Promise<Nullable<User>>;
    user(id: string): Nullable<User> | Promise<Nullable<User>>;
    users(): User[] | Promise<User[]>;
    card(id: string): Nullable<Card> | Promise<Nullable<Card>>;
    cards(): Card[] | Promise<Card[]>;
    myCards(): Card[] | Promise<Card[]>;
    cardsWithRelations(): CardWithRelations[] | Promise<CardWithRelations[]>;
    templates(): FlattenedTemplate[] | Promise<FlattenedTemplate[]>;
    template(id: string): Nullable<FlattenedTemplate> | Promise<Nullable<FlattenedTemplate>>;
    templateWithInheritance(id: string): Nullable<Template> | Promise<Nullable<Template>>;
    userTemplates(): Template[] | Promise<Template[]>;
}

export interface IMutation {
    login(username: string, password: string): string | Promise<string>;
    register(username: string, password: string): User | Promise<User>;
    createTemplate(input: CreateTemplateInput): Template | Promise<Template>;
    updateTemplate(id: string, input: UpdateTemplateInput): Template | Promise<Template>;
    deleteTemplate(id: string): boolean | Promise<boolean>;
    createCard(templateId: string, title: string, content?: Nullable<string>, body?: Nullable<string>, meta?: Nullable<JSON>): Card | Promise<Card>;
    updateCard(id: string, title?: Nullable<string>, content?: Nullable<string>, body?: Nullable<string>, meta?: Nullable<JSON>): Card | Promise<Card>;
    deleteCard(id: string): boolean | Promise<boolean>;
    createRelation(fromCardId: string, toCardId: string): boolean | Promise<boolean>;
}

export type JSON = any;
type Nullable<T> = T | null;
