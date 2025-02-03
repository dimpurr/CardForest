import { gql } from '@apollo/client';

export const CREATE_MODEL = gql`
  mutation CreateModel($input: CreateModelInput!) {
    createModel(input: $input) {
      _id
      name
      inherits_from
      fields {
        _inherit_from
        fields {
          name
          type
          required
          default
        }
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_MODEL = gql`
  mutation UpdateModel($id: ID!, $input: UpdateModelInput!) {
    updateModel(id: $id, input: $input) {
      _id
      name
      inherits_from
      fields {
        _inherit_from
        fields {
          name
          type
          required
          default
        }
      }
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_MODEL = gql`
  mutation DeleteModel($id: ID!) {
    deleteModel(id: $id)
  }
`;
