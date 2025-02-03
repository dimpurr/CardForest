
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

export interface CreateModelInput {
    name: string;
    inherits_from?: Nullable<string[]>;
    fields: FieldGroupInput[];
}

export interface UpdateModelInput {
    name?: Nullable<string>;
    inherits_from?: Nullable<string[]>;
    fields?: Nullable<FieldGroupInput[]>;
}

export interface CreateCardInput {
    modelId: string;
    title: string;
    content?: Nullable<string>;
    body?: Nullable<string>;
    meta?: Nullable<JSON>;
}

export interface UpdateCardInput {
    title?: Nullable<string>;
    content?: Nullable<string>;
    body?: Nullable<string>;
    meta?: Nullable<JSON>;
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

export interface Model {
    _key: string;
    _id: string;
    _rev?: Nullable<string>;
    name: string;
    inherits_from: string[];
    fields: FieldGroup[];
    system: boolean;
    createdAt: string;
    updatedAt?: Nullable<string>;
    createdBy?: Nullable<string>;
}

export interface Card {
    _key: string;
    _id: string;
    modelId: string;
    model?: Nullable<Model>;
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

export interface AuthResponse {
    token: string;
    user: User;
}

export interface IQuery {
    me(): Nullable<User> | Promise<Nullable<User>>;
    model(id: string): Nullable<Model> | Promise<Nullable<Model>>;
    models(): Model[] | Promise<Model[]>;
    flattenedModel(id: string): Nullable<Model> | Promise<Nullable<Model>>;
    card(id: string): Nullable<Card> | Promise<Nullable<Card>>;
    cards(): Card[] | Promise<Card[]>;
    myCards(): Card[] | Promise<Card[]>;
    cardsWithRelations(): CardWithRelations[] | Promise<CardWithRelations[]>;
}

export interface IMutation {
    login(username: string, password: string): AuthResponse | Promise<AuthResponse>;
    register(username: string, password: string): User | Promise<User>;
    createModel(input: CreateModelInput): Model | Promise<Model>;
    updateModel(id: string, input: UpdateModelInput): Model | Promise<Model>;
    deleteModel(id: string): boolean | Promise<boolean>;
    createCard(input: CreateCardInput): Card | Promise<Card>;
    updateCard(id: string, input: UpdateCardInput): Card | Promise<Card>;
    deleteCard(id: string): boolean | Promise<boolean>;
    createCardRelation(fromCardId: string, toCardId: string): boolean | Promise<boolean>;
}

export type JSON = any;
type Nullable<T> = T | null;
