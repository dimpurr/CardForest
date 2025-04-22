import { gql } from '@apollo/client';
import { MODEL_FIELDS_FRAGMENT, MODEL_FULL_FRAGMENT } from '../fragments/modelFragments';

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
      ...ModelFull
    }
  }
  ${MODEL_FULL_FRAGMENT}
`;

export const GET_MODEL_WITH_INHERITANCE = gql`
  query GetModelWithInheritance($id: ID!) {
    model(id: $id) {
      ...ModelFull
    }
    inheritedModels: models {
      ...ModelFields
    }
  }
  ${MODEL_FULL_FRAGMENT}
  ${MODEL_FIELDS_FRAGMENT}
`;

export const GET_MODEL_BY_ID = gql`
  query GetModelById($id: ID!) {
    model(id: $id) {
      ...ModelFields
    }
  }
  ${MODEL_FIELDS_FRAGMENT}
`;
