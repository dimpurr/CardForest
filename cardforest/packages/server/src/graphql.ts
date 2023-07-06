
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface IQuery {
    getAllUsers(): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;
    getAllCards(): Nullable<Nullable<Card>[]> | Promise<Nullable<Nullable<Card>[]>>;
}

export interface User {
    id: string;
    username: string;
    password: string;
}

export interface Card {
    id: string;
    title: string;
    content: string;
}

type Nullable<T> = T | null;
