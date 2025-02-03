
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateCardInput {
    model: string;
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

export interface CreateModelInput {
    name: string;
    extends?: Nullable<string>;
    fields: JSON;
}

export interface UpdateModelInput {
    name?: Nullable<string>;
    fields?: Nullable<JSON>;
}

export interface IQuery {
    users(): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;
    cards(): Nullable<Nullable<Card>[]> | Promise<Nullable<Nullable<Card>[]>>;
    myCards(): Nullable<Nullable<Card>[]> | Promise<Nullable<Nullable<Card>[]>>;
    card(id: string): Nullable<Card> | Promise<Nullable<Card>>;
    models(): Nullable<Nullable<Model>[]> | Promise<Nullable<Nullable<Model>[]>>;
    model(id: string): Nullable<Model> | Promise<Nullable<Model>>;
}

export interface IMutation {
    createCard(input: CreateCardInput): Nullable<Card> | Promise<Nullable<Card>>;
    updateCard(id: string, input: UpdateCardInput): Nullable<Card> | Promise<Nullable<Card>>;
    deleteCard(id: string): Nullable<boolean> | Promise<Nullable<boolean>>;
    createModel(input: CreateModelInput): Nullable<Model> | Promise<Nullable<Model>>;
    updateModel(id: string, input: UpdateModelInput): Nullable<Model> | Promise<Nullable<Model>>;
    deleteModel(id: string): Nullable<boolean> | Promise<Nullable<boolean>>;
}

export interface User {
    _id: string;
    username: string;
    password: string;
    cards?: Nullable<Nullable<Card>[]>;
}

export interface Model {
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
    model: Model;
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
