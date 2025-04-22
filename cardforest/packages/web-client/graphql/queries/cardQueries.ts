import { gql } from '@apollo/client';
import { CARD_FULL_FRAGMENT } from '../fragments/cardFragments';

export const GET_CARD = gql`
  query GetCard($id: ID!) {
    card(id: $id) {
      ...CardFull
    }
  }
  ${CARD_FULL_FRAGMENT}
`;

export const GET_CARD_WITH_MODEL = gql`
  query GetCardWithModel($id: ID!) {
    card(id: $id) {
      ...CardFull
    }
  }
  ${CARD_FULL_FRAGMENT}
`;

export const GET_MY_CARDS = gql`
  query GetMyCards {
    myCards {
      ...CardFull
    }
  }
  ${CARD_FULL_FRAGMENT}
`;
