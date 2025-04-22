import { gql } from '@apollo/client';

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

export const GET_MODELS = gql`
  query GetModels {
    models {
      _id
      _key
      name
    }
  }
`;

export const GET_MODEL_BY_ID = gql`
  query GetModelById($id: ID!) {
    model(id: $id) {
      _id
      _key
      name
      fields {
        _inherit_from
        fields {
          name
          type
          required
          config
        }
      }
      createdAt
      updatedAt
    }
  }
`;
