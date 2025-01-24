import { gql } from '@apollo/client';

export const GET_CARDS = gql`
  query GetCards {
    cards {
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

export const GET_CARD = gql`
  query GetCard($id: ID!) {
    card(id: $id) {
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
        fields {
          _inherit_from
          fields {
            name
            type
            required
            options
          }
        }
      }
    }
  }
`;
