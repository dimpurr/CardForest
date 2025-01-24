
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateCardInput {
    title: string;
    content: string;
}

export interface UpdateCardInput {
    title?: Nullable<string>;
    content?: Nullable<string>;
}

export interface IQuery {
    users(): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;
    cards(): Nullable<Nullable<Card>[]> | Promise<Nullable<Nullable<Card>[]>>;
    myCards(): Nullable<Nullable<Card>[]> | Promise<Nullable<Nullable<Card>[]>>;
    card(id: string): Nullable<Card> | Promise<Nullable<Card>>;
}

export interface IMutation {
    createCard(input: CreateCardInput): Nullable<Card> | Promise<Nullable<Card>>;
    updateCard(id: string, input: UpdateCardInput): Nullable<Card> | Promise<Nullable<Card>>;
    deleteCard(id: string): Nullable<boolean> | Promise<Nullable<boolean>>;
}

export interface User {
    _id: string;
    username: string;
    password: string;
    cards?: Nullable<Nullable<Card>[]>;
}

export interface Card {
    _id: string;
    title: string;
    content: string;
    createdBy: User;
    createdAt: string;
    updatedAt?: Nullable<string>;
}

type Nullable<T> = T | null;
