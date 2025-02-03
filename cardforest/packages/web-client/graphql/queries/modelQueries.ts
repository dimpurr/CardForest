import { gql } from '@apollo/client';

export const MODEL_FIELDS_FRAGMENT = gql`
  fragment ModelFields on Model {
    _id
    name
    fields {
      _inherit_from
      fields {
        name
        type
        required
        default
        __typename
      }
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
`;

export const GET_MODELS = gql`
  query GetModels {
    models {
      ...ModelFields
    }
  }
  ${MODEL_FIELDS_FRAGMENT}
`;

export const GET_MODEL = gql`
  query GetModel($id: ID!) {
    model(id: $id) {
      ...ModelFields
    }
  }
  ${MODEL_FIELDS_FRAGMENT}
`;

export const GET_MODEL_WITH_INHERITANCE = gql`
  query GetModelWithInheritance($id: ID!) {
    model(id: $id) {
      ...ModelFields
    }
    inheritedModels: models {
      ...ModelFields
    }
  }
  ${MODEL_FIELDS_FRAGMENT}
`;
