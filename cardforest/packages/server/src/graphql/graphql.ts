
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateCardInput {
    template: string;
    title: string;
    content?: Nullable<string>;
    body?: Nullable<string>;
    meta: JSON;
}

export interface UpdateCardInput {
    title?: Nullable<string>;
    content?: Nullable<string>;
    body?: Nullable<string>;
    meta?: Nullable<JSON>;
}

export interface CreateTemplateInput {
    name: string;
    fields: JSON;
    parent?: Nullable<string>;
}

export interface UpdateTemplateInput {
    name?: Nullable<string>;
    fields?: Nullable<JSON>;
    parent?: Nullable<string>;
}

export interface User {
    _key: string;
    _id: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Template {
    _key: string;
    _id: string;
    name: string;
    fields: JSON;
    parent?: Nullable<Template>;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: Nullable<User>;
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
    userCards(): Card[] | Promise<Card[]>;
    cardsWithRelations(): CardWithRelations[] | Promise<CardWithRelations[]>;
    template(id: string): Nullable<Template> | Promise<Nullable<Template>>;
    templates(): Template[] | Promise<Template[]>;
    userTemplates(): Template[] | Promise<Template[]>;
}

export interface IMutation {
    register(username: string, password: string): User | Promise<User>;
    login(username: string, password: string): string | Promise<string>;
    createCard(input: CreateCardInput): Card | Promise<Card>;
    updateCard(id: string, input: UpdateCardInput): Card | Promise<Card>;
    deleteCard(id: string): boolean | Promise<boolean>;
    createRelation(fromCardId: string, toCardId: string): boolean | Promise<boolean>;
    createTemplate(input: CreateTemplateInput): Template | Promise<Template>;
    updateTemplate(id: string, input: UpdateTemplateInput): Template | Promise<Template>;
    deleteTemplate(id: string): boolean | Promise<boolean>;
}

export type JSON = any;
type Nullable<T> = T | null;
