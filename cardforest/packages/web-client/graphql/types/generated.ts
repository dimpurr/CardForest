import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  token: Scalars['String']['output'];
  user: User;
};

export type Card = {
  __typename?: 'Card';
  _id: Scalars['ID']['output'];
  _key: Scalars['ID']['output'];
  body: Maybe<Scalars['String']['output']>;
  content: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy: User;
  meta: Scalars['JSON']['output'];
  model: Maybe<Model>;
  modelId: Scalars['ID']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type CardWithRelations = {
  __typename?: 'CardWithRelations';
  card: Card;
  children: Array<Card>;
};

export type CreateCardInput = {
  body: InputMaybe<Scalars['String']['input']>;
  content: InputMaybe<Scalars['String']['input']>;
  meta: InputMaybe<Scalars['JSON']['input']>;
  modelId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};

export type CreateModelInput = {
  fields: Array<FieldGroupInput>;
  inherits_from: InputMaybe<Array<Scalars['String']['input']>>;
  name: Scalars['String']['input'];
};

export type FieldDefinition = {
  __typename?: 'FieldDefinition';
  config: Maybe<Scalars['JSON']['output']>;
  default: Maybe<Scalars['JSON']['output']>;
  name: Scalars['String']['output'];
  required: Maybe<Scalars['Boolean']['output']>;
  type: Scalars['String']['output'];
};

export type FieldDefinitionInput = {
  config: InputMaybe<Scalars['JSON']['input']>;
  default: InputMaybe<Scalars['JSON']['input']>;
  name: Scalars['String']['input'];
  required: InputMaybe<Scalars['Boolean']['input']>;
  type: Scalars['String']['input'];
};

export type FieldGroup = {
  __typename?: 'FieldGroup';
  _inherit_from: Scalars['String']['output'];
  fields: Array<FieldDefinition>;
};

export type FieldGroupInput = {
  _inherit_from: Scalars['String']['input'];
  fields: Array<FieldDefinitionInput>;
};

export type Model = {
  __typename?: 'Model';
  _id: Scalars['ID']['output'];
  _key: Scalars['ID']['output'];
  _rev: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  createdBy: Maybe<Scalars['String']['output']>;
  fields: Array<FieldGroup>;
  inherits_from: Array<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  system: Scalars['Boolean']['output'];
  updatedAt: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createCard: Card;
  createCardRelation: Scalars['Boolean']['output'];
  createModel: Model;
  deleteCard: Scalars['Boolean']['output'];
  deleteModel: Scalars['Boolean']['output'];
  login: AuthResponse;
  register: User;
  updateCard: Card;
  updateModel: Model;
};


export type MutationCreateCardArgs = {
  input: CreateCardInput;
};


export type MutationCreateCardRelationArgs = {
  fromCardId: Scalars['ID']['input'];
  toCardId: Scalars['ID']['input'];
};


export type MutationCreateModelArgs = {
  input: CreateModelInput;
};


export type MutationDeleteCardArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteModelArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationUpdateCardArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCardInput;
};


export type MutationUpdateModelArgs = {
  id: Scalars['ID']['input'];
  input: UpdateModelInput;
};

export type Query = {
  __typename?: 'Query';
  card: Maybe<Card>;
  cards: Array<Card>;
  cardsWithRelations: Array<CardWithRelations>;
  flattenedModel: Maybe<Model>;
  me: Maybe<User>;
  model: Maybe<Model>;
  models: Array<Model>;
  myCards: Array<Card>;
};


export type QueryCardArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFlattenedModelArgs = {
  id: Scalars['ID']['input'];
};


export type QueryModelArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateCardInput = {
  body: InputMaybe<Scalars['String']['input']>;
  content: InputMaybe<Scalars['String']['input']>;
  meta: InputMaybe<Scalars['JSON']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
};

export type UpdateModelInput = {
  fields: InputMaybe<Array<FieldGroupInput>>;
  inherits_from: InputMaybe<Array<Scalars['String']['input']>>;
  name: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID']['output'];
  _key: Scalars['ID']['output'];
  createdAt: Scalars['Date']['output'];
  updatedAt: Scalars['Date']['output'];
  username: Scalars['String']['output'];
};

export type CardBasicFieldsFragment = { __typename: 'Card', _id: string, _key: string, modelId: string, title: string, content: string | null, body: string | null, meta: any, createdAt: any, updatedAt: any };

export type CardWithModelFragment = { __typename: 'Card', _id: string, _key: string, modelId: string, title: string, content: string | null, body: string | null, meta: any, createdAt: any, updatedAt: any, model: { __typename: 'Model', _id: string, _key: string, name: string, fields: Array<{ __typename: 'FieldGroup', _inherit_from: string, fields: Array<{ __typename?: 'FieldDefinition', name: string, type: string, required: boolean | null, default: any | null, config: any | null }> }> } | null };

export type CardWithCreatorFragment = { __typename: 'Card', _id: string, _key: string, modelId: string, title: string, content: string | null, body: string | null, meta: any, createdAt: any, updatedAt: any, createdBy: { __typename: 'User', username: string } };

export type CardFullFragment = { __typename: 'Card', _id: string, _key: string, modelId: string, title: string, content: string | null, body: string | null, meta: any, createdAt: any, updatedAt: any, createdBy: { __typename: 'User', username: string }, model: { __typename: 'Model', _id: string, _key: string, name: string, fields: Array<{ __typename: 'FieldGroup', _inherit_from: string, fields: Array<{ __typename?: 'FieldDefinition', name: string, type: string, required: boolean | null, default: any | null, config: any | null }> }> } | null };

export type ModelBasicFieldsFragment = { __typename: 'Model', _id: string, _key: string, name: string, createdAt: string, updatedAt: string | null };

export type ModelFieldFragment = { __typename: 'FieldDefinition', name: string, type: string, required: boolean | null, default: any | null, config: any | null };

export type ModelFieldsFragment = { __typename: 'Model', _id: string, _key: string, name: string, createdAt: string, updatedAt: string | null, fields: Array<{ __typename: 'FieldGroup', _inherit_from: string, fields: Array<{ __typename: 'FieldDefinition', name: string, type: string, required: boolean | null, default: any | null, config: any | null }> }> };

export type ModelFullFragment = { __typename: 'Model', inherits_from: Array<string>, system: boolean, createdBy: string | null, _id: string, _key: string, name: string, createdAt: string, updatedAt: string | null, fields: Array<{ __typename: 'FieldGroup', _inherit_from: string, fields: Array<{ __typename: 'FieldDefinition', name: string, type: string, required: boolean | null, default: any | null, config: any | null }> }> };

export type UserBasicFieldsFragment = { __typename: 'User', _id: string, _key: string, username: string };

export type UserFullFragment = { __typename: 'User', createdAt: any, updatedAt: any, _id: string, _key: string, username: string };

export type CreateCardMutationVariables = Exact<{
  input: CreateCardInput;
}>;


export type CreateCardMutation = { __typename?: 'Mutation', createCard: { __typename: 'Card', _id: string, _key: string, modelId: string, title: string, content: string | null, body: string | null, meta: any, createdAt: any, updatedAt: any, createdBy: { __typename: 'User', username: string }, model: { __typename: 'Model', _id: string, _key: string, name: string, fields: Array<{ __typename: 'FieldGroup', _inherit_from: string, fields: Array<{ __typename?: 'FieldDefinition', name: string, type: string, required: boolean | null, default: any | null, config: any | null }> }> } | null } };

export type UpdateCardMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateCardInput;
}>;


export type UpdateCardMutation = { __typename?: 'Mutation', updateCard: { __typename: 'Card', _id: string, _key: string, modelId: string, title: string, content: string | null, body: string | null, meta: any, createdAt: any, updatedAt: any, createdBy: { __typename: 'User', username: string }, model: { __typename: 'Model', _id: string, _key: string, name: string, fields: Array<{ __typename: 'FieldGroup', _inherit_from: string, fields: Array<{ __typename?: 'FieldDefinition', name: string, type: string, required: boolean | null, default: any | null, config: any | null }> }> } | null } };

export type DeleteCardMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCardMutation = { __typename?: 'Mutation', deleteCard: boolean };

export type CreateModelMutationVariables = Exact<{
  input: CreateModelInput;
}>;


export type CreateModelMutation = { __typename?: 'Mutation', createModel: { __typename: 'Model', inherits_from: Array<string>, system: boolean, createdBy: string | null, _id: string, _key: string, name: string, createdAt: string, updatedAt: string | null, fields: Array<{ __typename: 'FieldGroup', _inherit_from: string, fields: Array<{ __typename: 'FieldDefinition', name: string, type: string, required: boolean | null, default: any | null, config: any | null }> }> } };

export type UpdateModelMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateModelInput;
}>;


export type UpdateModelMutation = { __typename?: 'Mutation', updateModel: { __typename: 'Model', inherits_from: Array<string>, system: boolean, createdBy: string | null, _id: string, _key: string, name: string, createdAt: string, updatedAt: string | null, fields: Array<{ __typename: 'FieldGroup', _inherit_from: string, fields: Array<{ __typename: 'FieldDefinition', name: string, type: string, required: boolean | null, default: any | null, config: any | null }> }> } };

export type DeleteModelMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteModelMutation = { __typename?: 'Mutation', deleteModel: boolean };

export type LoginMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthResponse', token: string, user: { __typename: 'User', createdAt: any, updatedAt: any, _id: string, _key: string, username: string } } };

export type RegisterMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename: 'User', createdAt: any, updatedAt: any, _id: string, _key: string, username: string } };

export type GetCardQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCardQuery = { __typename?: 'Query', card: { __typename: 'Card', _id: string, _key: string, modelId: string, title: string, content: string | null, body: string | null, meta: any, createdAt: any, updatedAt: any, createdBy: { __typename: 'User', username: string }, model: { __typename: 'Model', _id: string, _key: string, name: string, fields: Array<{ __typename: 'FieldGroup', _inherit_from: string, fields: Array<{ __typename?: 'FieldDefinition', name: string, type: string, required: boolean | null, default: any | null, config: any | null }> }> } | null } | null };

export type GetCardWithModelQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCardWithModelQuery = { __typename?: 'Query', card: { __typename: 'Card', _id: string, _key: string, modelId: string, title: string, content: string | null, body: string | null, meta: any, createdAt: any, updatedAt: any, createdBy: { __typename: 'User', username: string }, model: { __typename: 'Model', _id: string, _key: string, name: string, fields: Array<{ __typename: 'FieldGroup', _inherit_from: string, fields: Array<{ __typename?: 'FieldDefinition', name: string, type: string, required: boolean | null, default: any | null, config: any | null }> }> } | null } | null };

export type GetMyCardsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyCardsQuery = { __typename?: 'Query', myCards: Array<{ __typename: 'Card', _id: string, _key: string, modelId: string, title: string, content: string | null, body: string | null, meta: any, createdAt: any, updatedAt: any, createdBy: { __typename: 'User', username: string }, model: { __typename: 'Model', _id: string, _key: string, name: string, fields: Array<{ __typename: 'FieldGroup', _inherit_from: string, fields: Array<{ __typename?: 'FieldDefinition', name: string, type: string, required: boolean | null, default: any | null, config: any | null }> }> } | null }> };

export type GetModelsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetModelsQuery = { __typename?: 'Query', models: Array<{ __typename: 'Model', _id: string, _key: string, name: string, createdAt: string, updatedAt: string | null, fields: Array<{ __typename: 'FieldGroup', _inherit_from: string, fields: Array<{ __typename: 'FieldDefinition', name: string, type: string, required: boolean | null, default: any | null, config: any | null }> }> }> };

export type GetModelQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetModelQuery = { __typename?: 'Query', model: { __typename: 'Model', inherits_from: Array<string>, system: boolean, createdBy: string | null, _id: string, _key: string, name: string, createdAt: string, updatedAt: string | null, fields: Array<{ __typename: 'FieldGroup', _inherit_from: string, fields: Array<{ __typename: 'FieldDefinition', name: string, type: string, required: boolean | null, default: any | null, config: any | null }> }> } | null };

export type GetModelWithInheritanceQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetModelWithInheritanceQuery = { __typename?: 'Query', model: { __typename: 'Model', inherits_from: Array<string>, system: boolean, createdBy: string | null, _id: string, _key: string, name: string, createdAt: string, updatedAt: string | null, fields: Array<{ __typename: 'FieldGroup', _inherit_from: string, fields: Array<{ __typename: 'FieldDefinition', name: string, type: string, required: boolean | null, default: any | null, config: any | null }> }> } | null, inheritedModels: Array<{ __typename: 'Model', _id: string, _key: string, name: string, createdAt: string, updatedAt: string | null, fields: Array<{ __typename: 'FieldGroup', _inherit_from: string, fields: Array<{ __typename: 'FieldDefinition', name: string, type: string, required: boolean | null, default: any | null, config: any | null }> }> }> };

export type GetModelByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetModelByIdQuery = { __typename?: 'Query', model: { __typename: 'Model', _id: string, _key: string, name: string, createdAt: string, updatedAt: string | null, fields: Array<{ __typename: 'FieldGroup', _inherit_from: string, fields: Array<{ __typename: 'FieldDefinition', name: string, type: string, required: boolean | null, default: any | null, config: any | null }> }> } | null };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me: { __typename: 'User', createdAt: any, updatedAt: any, _id: string, _key: string, username: string } | null };

export const CardBasicFieldsFragmentDoc = gql`
    fragment CardBasicFields on Card {
  _id
  _key
  modelId
  title
  content
  body
  meta
  createdAt
  updatedAt
  __typename
}
    `;
export const CardWithCreatorFragmentDoc = gql`
    fragment CardWithCreator on Card {
  ...CardBasicFields
  createdBy {
    username
    __typename
  }
  __typename
}
    ${CardBasicFieldsFragmentDoc}`;
export const CardWithModelFragmentDoc = gql`
    fragment CardWithModel on Card {
  ...CardBasicFields
  model {
    _id
    _key
    name
    fields {
      _inherit_from
      fields {
        name
        type
        required
        default
        config
      }
      __typename
    }
    __typename
  }
  __typename
}
    ${CardBasicFieldsFragmentDoc}`;
export const CardFullFragmentDoc = gql`
    fragment CardFull on Card {
  ...CardBasicFields
  ...CardWithModel
  createdBy {
    username
    __typename
  }
  __typename
}
    ${CardBasicFieldsFragmentDoc}
${CardWithModelFragmentDoc}`;
export const ModelBasicFieldsFragmentDoc = gql`
    fragment ModelBasicFields on Model {
  _id
  _key
  name
  createdAt
  updatedAt
  __typename
}
    `;
export const ModelFieldFragmentDoc = gql`
    fragment ModelField on FieldDefinition {
  name
  type
  required
  default
  config
  __typename
}
    `;
export const ModelFieldsFragmentDoc = gql`
    fragment ModelFields on Model {
  ...ModelBasicFields
  fields {
    _inherit_from
    fields {
      ...ModelField
    }
    __typename
  }
  __typename
}
    ${ModelBasicFieldsFragmentDoc}
${ModelFieldFragmentDoc}`;
export const ModelFullFragmentDoc = gql`
    fragment ModelFull on Model {
  ...ModelFields
  inherits_from
  system
  createdBy
  __typename
}
    ${ModelFieldsFragmentDoc}`;
export const UserBasicFieldsFragmentDoc = gql`
    fragment UserBasicFields on User {
  _id
  _key
  username
  __typename
}
    `;
export const UserFullFragmentDoc = gql`
    fragment UserFull on User {
  ...UserBasicFields
  createdAt
  updatedAt
  __typename
}
    ${UserBasicFieldsFragmentDoc}`;
export const CreateCardDocument = gql`
    mutation CreateCard($input: CreateCardInput!) {
  createCard(input: $input) {
    ...CardFull
  }
}
    ${CardFullFragmentDoc}`;
export type CreateCardMutationFn = Apollo.MutationFunction<CreateCardMutation, CreateCardMutationVariables>;

/**
 * __useCreateCardMutation__
 *
 * To run a mutation, you first call `useCreateCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCardMutation, { data, loading, error }] = useCreateCardMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCardMutation(baseOptions?: Apollo.MutationHookOptions<CreateCardMutation, CreateCardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCardMutation, CreateCardMutationVariables>(CreateCardDocument, options);
      }
export type CreateCardMutationHookResult = ReturnType<typeof useCreateCardMutation>;
export type CreateCardMutationResult = Apollo.MutationResult<CreateCardMutation>;
export type CreateCardMutationOptions = Apollo.BaseMutationOptions<CreateCardMutation, CreateCardMutationVariables>;
export const UpdateCardDocument = gql`
    mutation UpdateCard($id: ID!, $input: UpdateCardInput!) {
  updateCard(id: $id, input: $input) {
    ...CardFull
  }
}
    ${CardFullFragmentDoc}`;
export type UpdateCardMutationFn = Apollo.MutationFunction<UpdateCardMutation, UpdateCardMutationVariables>;

/**
 * __useUpdateCardMutation__
 *
 * To run a mutation, you first call `useUpdateCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCardMutation, { data, loading, error }] = useUpdateCardMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCardMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCardMutation, UpdateCardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCardMutation, UpdateCardMutationVariables>(UpdateCardDocument, options);
      }
export type UpdateCardMutationHookResult = ReturnType<typeof useUpdateCardMutation>;
export type UpdateCardMutationResult = Apollo.MutationResult<UpdateCardMutation>;
export type UpdateCardMutationOptions = Apollo.BaseMutationOptions<UpdateCardMutation, UpdateCardMutationVariables>;
export const DeleteCardDocument = gql`
    mutation DeleteCard($id: ID!) {
  deleteCard(id: $id)
}
    `;
export type DeleteCardMutationFn = Apollo.MutationFunction<DeleteCardMutation, DeleteCardMutationVariables>;

/**
 * __useDeleteCardMutation__
 *
 * To run a mutation, you first call `useDeleteCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCardMutation, { data, loading, error }] = useDeleteCardMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCardMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCardMutation, DeleteCardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCardMutation, DeleteCardMutationVariables>(DeleteCardDocument, options);
      }
export type DeleteCardMutationHookResult = ReturnType<typeof useDeleteCardMutation>;
export type DeleteCardMutationResult = Apollo.MutationResult<DeleteCardMutation>;
export type DeleteCardMutationOptions = Apollo.BaseMutationOptions<DeleteCardMutation, DeleteCardMutationVariables>;
export const CreateModelDocument = gql`
    mutation CreateModel($input: CreateModelInput!) {
  createModel(input: $input) {
    ...ModelFull
  }
}
    ${ModelFullFragmentDoc}`;
export type CreateModelMutationFn = Apollo.MutationFunction<CreateModelMutation, CreateModelMutationVariables>;

/**
 * __useCreateModelMutation__
 *
 * To run a mutation, you first call `useCreateModelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateModelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createModelMutation, { data, loading, error }] = useCreateModelMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateModelMutation(baseOptions?: Apollo.MutationHookOptions<CreateModelMutation, CreateModelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateModelMutation, CreateModelMutationVariables>(CreateModelDocument, options);
      }
export type CreateModelMutationHookResult = ReturnType<typeof useCreateModelMutation>;
export type CreateModelMutationResult = Apollo.MutationResult<CreateModelMutation>;
export type CreateModelMutationOptions = Apollo.BaseMutationOptions<CreateModelMutation, CreateModelMutationVariables>;
export const UpdateModelDocument = gql`
    mutation UpdateModel($id: ID!, $input: UpdateModelInput!) {
  updateModel(id: $id, input: $input) {
    ...ModelFull
  }
}
    ${ModelFullFragmentDoc}`;
export type UpdateModelMutationFn = Apollo.MutationFunction<UpdateModelMutation, UpdateModelMutationVariables>;

/**
 * __useUpdateModelMutation__
 *
 * To run a mutation, you first call `useUpdateModelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateModelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateModelMutation, { data, loading, error }] = useUpdateModelMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateModelMutation(baseOptions?: Apollo.MutationHookOptions<UpdateModelMutation, UpdateModelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateModelMutation, UpdateModelMutationVariables>(UpdateModelDocument, options);
      }
export type UpdateModelMutationHookResult = ReturnType<typeof useUpdateModelMutation>;
export type UpdateModelMutationResult = Apollo.MutationResult<UpdateModelMutation>;
export type UpdateModelMutationOptions = Apollo.BaseMutationOptions<UpdateModelMutation, UpdateModelMutationVariables>;
export const DeleteModelDocument = gql`
    mutation DeleteModel($id: ID!) {
  deleteModel(id: $id)
}
    `;
export type DeleteModelMutationFn = Apollo.MutationFunction<DeleteModelMutation, DeleteModelMutationVariables>;

/**
 * __useDeleteModelMutation__
 *
 * To run a mutation, you first call `useDeleteModelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteModelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteModelMutation, { data, loading, error }] = useDeleteModelMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteModelMutation(baseOptions?: Apollo.MutationHookOptions<DeleteModelMutation, DeleteModelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteModelMutation, DeleteModelMutationVariables>(DeleteModelDocument, options);
      }
export type DeleteModelMutationHookResult = ReturnType<typeof useDeleteModelMutation>;
export type DeleteModelMutationResult = Apollo.MutationResult<DeleteModelMutation>;
export type DeleteModelMutationOptions = Apollo.BaseMutationOptions<DeleteModelMutation, DeleteModelMutationVariables>;
export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    token
    user {
      ...UserFull
    }
  }
}
    ${UserFullFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($username: String!, $password: String!) {
  register(username: $username, password: $password) {
    ...UserFull
  }
}
    ${UserFullFragmentDoc}`;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const GetCardDocument = gql`
    query GetCard($id: ID!) {
  card(id: $id) {
    ...CardFull
  }
}
    ${CardFullFragmentDoc}`;

/**
 * __useGetCardQuery__
 *
 * To run a query within a React component, call `useGetCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCardQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCardQuery(baseOptions: Apollo.QueryHookOptions<GetCardQuery, GetCardQueryVariables> & ({ variables: GetCardQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCardQuery, GetCardQueryVariables>(GetCardDocument, options);
      }
export function useGetCardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCardQuery, GetCardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCardQuery, GetCardQueryVariables>(GetCardDocument, options);
        }
export function useGetCardSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCardQuery, GetCardQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCardQuery, GetCardQueryVariables>(GetCardDocument, options);
        }
export type GetCardQueryHookResult = ReturnType<typeof useGetCardQuery>;
export type GetCardLazyQueryHookResult = ReturnType<typeof useGetCardLazyQuery>;
export type GetCardSuspenseQueryHookResult = ReturnType<typeof useGetCardSuspenseQuery>;
export type GetCardQueryResult = Apollo.QueryResult<GetCardQuery, GetCardQueryVariables>;
export const GetCardWithModelDocument = gql`
    query GetCardWithModel($id: ID!) {
  card(id: $id) {
    ...CardFull
  }
}
    ${CardFullFragmentDoc}`;

/**
 * __useGetCardWithModelQuery__
 *
 * To run a query within a React component, call `useGetCardWithModelQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCardWithModelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCardWithModelQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCardWithModelQuery(baseOptions: Apollo.QueryHookOptions<GetCardWithModelQuery, GetCardWithModelQueryVariables> & ({ variables: GetCardWithModelQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCardWithModelQuery, GetCardWithModelQueryVariables>(GetCardWithModelDocument, options);
      }
export function useGetCardWithModelLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCardWithModelQuery, GetCardWithModelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCardWithModelQuery, GetCardWithModelQueryVariables>(GetCardWithModelDocument, options);
        }
export function useGetCardWithModelSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCardWithModelQuery, GetCardWithModelQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCardWithModelQuery, GetCardWithModelQueryVariables>(GetCardWithModelDocument, options);
        }
export type GetCardWithModelQueryHookResult = ReturnType<typeof useGetCardWithModelQuery>;
export type GetCardWithModelLazyQueryHookResult = ReturnType<typeof useGetCardWithModelLazyQuery>;
export type GetCardWithModelSuspenseQueryHookResult = ReturnType<typeof useGetCardWithModelSuspenseQuery>;
export type GetCardWithModelQueryResult = Apollo.QueryResult<GetCardWithModelQuery, GetCardWithModelQueryVariables>;
export const GetMyCardsDocument = gql`
    query GetMyCards {
  myCards {
    ...CardFull
  }
}
    ${CardFullFragmentDoc}`;

/**
 * __useGetMyCardsQuery__
 *
 * To run a query within a React component, call `useGetMyCardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyCardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyCardsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyCardsQuery(baseOptions?: Apollo.QueryHookOptions<GetMyCardsQuery, GetMyCardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyCardsQuery, GetMyCardsQueryVariables>(GetMyCardsDocument, options);
      }
export function useGetMyCardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyCardsQuery, GetMyCardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyCardsQuery, GetMyCardsQueryVariables>(GetMyCardsDocument, options);
        }
export function useGetMyCardsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyCardsQuery, GetMyCardsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyCardsQuery, GetMyCardsQueryVariables>(GetMyCardsDocument, options);
        }
export type GetMyCardsQueryHookResult = ReturnType<typeof useGetMyCardsQuery>;
export type GetMyCardsLazyQueryHookResult = ReturnType<typeof useGetMyCardsLazyQuery>;
export type GetMyCardsSuspenseQueryHookResult = ReturnType<typeof useGetMyCardsSuspenseQuery>;
export type GetMyCardsQueryResult = Apollo.QueryResult<GetMyCardsQuery, GetMyCardsQueryVariables>;
export const GetModelsDocument = gql`
    query GetModels {
  models {
    ...ModelFields
  }
}
    ${ModelFieldsFragmentDoc}`;

/**
 * __useGetModelsQuery__
 *
 * To run a query within a React component, call `useGetModelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetModelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetModelsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetModelsQuery(baseOptions?: Apollo.QueryHookOptions<GetModelsQuery, GetModelsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetModelsQuery, GetModelsQueryVariables>(GetModelsDocument, options);
      }
export function useGetModelsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetModelsQuery, GetModelsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetModelsQuery, GetModelsQueryVariables>(GetModelsDocument, options);
        }
export function useGetModelsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetModelsQuery, GetModelsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetModelsQuery, GetModelsQueryVariables>(GetModelsDocument, options);
        }
export type GetModelsQueryHookResult = ReturnType<typeof useGetModelsQuery>;
export type GetModelsLazyQueryHookResult = ReturnType<typeof useGetModelsLazyQuery>;
export type GetModelsSuspenseQueryHookResult = ReturnType<typeof useGetModelsSuspenseQuery>;
export type GetModelsQueryResult = Apollo.QueryResult<GetModelsQuery, GetModelsQueryVariables>;
export const GetModelDocument = gql`
    query GetModel($id: ID!) {
  model(id: $id) {
    ...ModelFull
  }
}
    ${ModelFullFragmentDoc}`;

/**
 * __useGetModelQuery__
 *
 * To run a query within a React component, call `useGetModelQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetModelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetModelQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetModelQuery(baseOptions: Apollo.QueryHookOptions<GetModelQuery, GetModelQueryVariables> & ({ variables: GetModelQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetModelQuery, GetModelQueryVariables>(GetModelDocument, options);
      }
export function useGetModelLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetModelQuery, GetModelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetModelQuery, GetModelQueryVariables>(GetModelDocument, options);
        }
export function useGetModelSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetModelQuery, GetModelQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetModelQuery, GetModelQueryVariables>(GetModelDocument, options);
        }
export type GetModelQueryHookResult = ReturnType<typeof useGetModelQuery>;
export type GetModelLazyQueryHookResult = ReturnType<typeof useGetModelLazyQuery>;
export type GetModelSuspenseQueryHookResult = ReturnType<typeof useGetModelSuspenseQuery>;
export type GetModelQueryResult = Apollo.QueryResult<GetModelQuery, GetModelQueryVariables>;
export const GetModelWithInheritanceDocument = gql`
    query GetModelWithInheritance($id: ID!) {
  model(id: $id) {
    ...ModelFull
  }
  inheritedModels: models {
    ...ModelFields
  }
}
    ${ModelFullFragmentDoc}
${ModelFieldsFragmentDoc}`;

/**
 * __useGetModelWithInheritanceQuery__
 *
 * To run a query within a React component, call `useGetModelWithInheritanceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetModelWithInheritanceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetModelWithInheritanceQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetModelWithInheritanceQuery(baseOptions: Apollo.QueryHookOptions<GetModelWithInheritanceQuery, GetModelWithInheritanceQueryVariables> & ({ variables: GetModelWithInheritanceQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetModelWithInheritanceQuery, GetModelWithInheritanceQueryVariables>(GetModelWithInheritanceDocument, options);
      }
export function useGetModelWithInheritanceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetModelWithInheritanceQuery, GetModelWithInheritanceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetModelWithInheritanceQuery, GetModelWithInheritanceQueryVariables>(GetModelWithInheritanceDocument, options);
        }
export function useGetModelWithInheritanceSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetModelWithInheritanceQuery, GetModelWithInheritanceQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetModelWithInheritanceQuery, GetModelWithInheritanceQueryVariables>(GetModelWithInheritanceDocument, options);
        }
export type GetModelWithInheritanceQueryHookResult = ReturnType<typeof useGetModelWithInheritanceQuery>;
export type GetModelWithInheritanceLazyQueryHookResult = ReturnType<typeof useGetModelWithInheritanceLazyQuery>;
export type GetModelWithInheritanceSuspenseQueryHookResult = ReturnType<typeof useGetModelWithInheritanceSuspenseQuery>;
export type GetModelWithInheritanceQueryResult = Apollo.QueryResult<GetModelWithInheritanceQuery, GetModelWithInheritanceQueryVariables>;
export const GetModelByIdDocument = gql`
    query GetModelById($id: ID!) {
  model(id: $id) {
    ...ModelFields
  }
}
    ${ModelFieldsFragmentDoc}`;

/**
 * __useGetModelByIdQuery__
 *
 * To run a query within a React component, call `useGetModelByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetModelByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetModelByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetModelByIdQuery(baseOptions: Apollo.QueryHookOptions<GetModelByIdQuery, GetModelByIdQueryVariables> & ({ variables: GetModelByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetModelByIdQuery, GetModelByIdQueryVariables>(GetModelByIdDocument, options);
      }
export function useGetModelByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetModelByIdQuery, GetModelByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetModelByIdQuery, GetModelByIdQueryVariables>(GetModelByIdDocument, options);
        }
export function useGetModelByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetModelByIdQuery, GetModelByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetModelByIdQuery, GetModelByIdQueryVariables>(GetModelByIdDocument, options);
        }
export type GetModelByIdQueryHookResult = ReturnType<typeof useGetModelByIdQuery>;
export type GetModelByIdLazyQueryHookResult = ReturnType<typeof useGetModelByIdLazyQuery>;
export type GetModelByIdSuspenseQueryHookResult = ReturnType<typeof useGetModelByIdSuspenseQuery>;
export type GetModelByIdQueryResult = Apollo.QueryResult<GetModelByIdQuery, GetModelByIdQueryVariables>;
export const GetMeDocument = gql`
    query GetMe {
  me {
    ...UserFull
  }
}
    ${UserFullFragmentDoc}`;

/**
 * __useGetMeQuery__
 *
 * To run a query within a React component, call `useGetMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMeQuery(baseOptions?: Apollo.QueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, options);
      }
export function useGetMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, options);
        }
export function useGetMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, options);
        }
export type GetMeQueryHookResult = ReturnType<typeof useGetMeQuery>;
export type GetMeLazyQueryHookResult = ReturnType<typeof useGetMeLazyQuery>;
export type GetMeSuspenseQueryHookResult = ReturnType<typeof useGetMeSuspenseQuery>;
export type GetMeQueryResult = Apollo.QueryResult<GetMeQuery, GetMeQueryVariables>;