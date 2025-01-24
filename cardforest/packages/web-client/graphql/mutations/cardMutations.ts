import { gql } from '@apollo/client';

export const CREATE_CARD = gql`
  mutation CreateCard($input: CreateCardInput!) {
    createCard(input: $input) {
      _id
      templateId
      title
      content
      body
      meta
      createdAt
      updatedAt
      createdBy {
        username
      }
    }
  }
`;

export const UPDATE_CARD = gql`
  mutation UpdateCard($id: ID!, $input: UpdateCardInput!) {
    updateCard(id: $id, input: $input) {
      _id
      templateId
      title
      content
      body
      meta
      createdAt
      updatedAt
      createdBy {
        username
      }
    }
  }
`;

export const DELETE_CARD = gql`
  mutation DeleteCard($id: ID!) {
    deleteCard(id: $id) {
      _id
    }
  }
`;
