import { gql } from '@apollo/client';

export const GET_CARD = gql`
  query GetCard($id: ID!) {
    card(id: $id) {
      _id
      modelId
      title
      content
      body
      meta
      createdAt
      updatedAt
      createdBy {
        username
      }
      model {
        _id
        name
        fields {
          _inherit_from
          fields {
            name
            type
            required
            default
          }
        }
      }
    }
  }
`;

export const GET_CARD_WITH_MODEL = gql`
  query GetCardWithModel($id: ID!) {
    card(id: $id) {
      _id
      modelId
      title
      content
      body
      meta
      createdAt
      updatedAt
      createdBy {
        username
      }
      model {
        _id
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
        }
      }
    }
  }
`;

export const GET_MY_CARDS = gql`
  query GetMyCards {
    myCards {
      _id
      modelId
      title
      content
      body
      meta
      createdAt
      updatedAt
      model {
        _id
        name
        fields {
          _inherit_from
          fields {
            name
            type
            required
            default
          }
        }
      }
      createdBy {
        username
      }
    }
  }
`;
