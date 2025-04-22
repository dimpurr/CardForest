import { gql } from '@apollo/client';
import { CARD_FULL_FRAGMENT } from '../fragments/cardFragments';

export const CREATE_CARD = gql`
  mutation CreateCard($input: CreateCardInput!) {
    createCard(input: $input) {
      ...CardFull
    }
  }
  ${CARD_FULL_FRAGMENT}
`;

export const UPDATE_CARD = gql`
  mutation UpdateCard($id: ID!, $input: UpdateCardInput!) {
    updateCard(id: $id, input: $input) {
      ...CardFull
    }
  }
  ${CARD_FULL_FRAGMENT}
`;

export const DELETE_CARD = gql`
  mutation DeleteCard($id: ID!) {
    deleteCard(id: $id)
  }
`;
