import { gql } from '@apollo/client';

export const GET_CARD = gql`
  query GetCard($id: ID!) {
    card(id: $id) {
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

export const GET_CARD_WITH_TEMPLATE = gql`
  query GetCardWithTemplate($id: ID!) {
    card(id: $id) {
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
      template {
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
      templateId
      title
      content
      body
      meta
      createdAt
      updatedAt
      template {
        _id
        name
        fields
      }
      createdBy {
        username
      }
    }
  }
`;
