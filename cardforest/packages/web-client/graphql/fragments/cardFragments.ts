import { gql } from '@apollo/client';

export const CARD_BASIC_FIELDS_FRAGMENT = gql`
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

export const CARD_WITH_MODEL_FRAGMENT = gql`
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
  ${CARD_BASIC_FIELDS_FRAGMENT}
`;

export const CARD_WITH_CREATOR_FRAGMENT = gql`
  fragment CardWithCreator on Card {
    ...CardBasicFields
    createdBy {
      username
      __typename
    }
    __typename
  }
  ${CARD_BASIC_FIELDS_FRAGMENT}
`;

export const CARD_FULL_FRAGMENT = gql`
  fragment CardFull on Card {
    ...CardBasicFields
    ...CardWithModel
    createdBy {
      username
      __typename
    }
    __typename
  }
  ${CARD_BASIC_FIELDS_FRAGMENT}
  ${CARD_WITH_MODEL_FRAGMENT}
`;
