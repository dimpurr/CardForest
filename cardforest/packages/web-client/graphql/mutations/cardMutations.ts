import { gql } from '@apollo/client';

export const CREATE_CARD = gql`
  mutation CreateCard($input: CreateCardInput!) {
    createCard(input: $input) {
      _id
      title
      content
      body
      meta
      createdAt
      updatedAt
      createdBy {
        username
      }
      template {
        _id
        name
      }
    }
  }
`;

export const UPDATE_CARD = gql`
  mutation UpdateCard($input: UpdateCardInput!) {
    updateCard(input: $input) {
      _id
      title
      content
      body
      meta
      createdAt
      updatedAt
      createdBy {
        username
      }
      template {
        _id
        name
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
