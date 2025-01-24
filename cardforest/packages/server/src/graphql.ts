
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
    extends?: Nullable<string>;
    fields: JSON;
}

export interface UpdateTemplateInput {
    name?: Nullable<string>;
    fields?: Nullable<JSON>;
}

export interface IQuery {
    users(): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;
    cards(): Nullable<Nullable<Card>[]> | Promise<Nullable<Nullable<Card>[]>>;
    myCards(): Nullable<Nullable<Card>[]> | Promise<Nullable<Nullable<Card>[]>>;
    card(id: string): Nullable<Card> | Promise<Nullable<Card>>;
    templates(): Nullable<Nullable<Template>[]> | Promise<Nullable<Nullable<Template>[]>>;
    template(id: string): Nullable<Template> | Promise<Nullable<Template>>;
}

export interface IMutation {
    createCard(input: CreateCardInput): Nullable<Card> | Promise<Nullable<Card>>;
    updateCard(id: string, input: UpdateCardInput): Nullable<Card> | Promise<Nullable<Card>>;
    deleteCard(id: string): Nullable<boolean> | Promise<Nullable<boolean>>;
    createTemplate(input: CreateTemplateInput): Nullable<Template> | Promise<Nullable<Template>>;
    updateTemplate(id: string, input: UpdateTemplateInput): Nullable<Template> | Promise<Nullable<Template>>;
    deleteTemplate(id: string): Nullable<boolean> | Promise<Nullable<boolean>>;
}

export interface User {
    _id: string;
    username: string;
    password: string;
    cards?: Nullable<Nullable<Card>[]>;
}

export interface Template {
    _id: string;
    name: string;
    extends?: Nullable<string>;
    fields: JSON;
    system: boolean;
    createdAt: string;
    updatedAt?: Nullable<string>;
    createdBy?: Nullable<User>;
}

export interface Card {
    _id: string;
    template: Template;
    title: string;
    content?: Nullable<string>;
    body?: Nullable<string>;
    meta: JSON;
    createdBy: User;
    createdAt: string;
    updatedAt?: Nullable<string>;
}

export type JSON = any;
type Nullable<T> = T | null;
