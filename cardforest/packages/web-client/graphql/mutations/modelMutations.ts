import { gql } from '@apollo/client';
import { MODEL_FULL_FRAGMENT } from '../fragments/modelFragments';

export const CREATE_MODEL = gql`
  mutation CreateModel($input: CreateModelInput!) {
    createModel(input: $input) {
      ...ModelFull
    }
  }
  ${MODEL_FULL_FRAGMENT}
`;

export const UPDATE_MODEL = gql`
  mutation UpdateModel($id: ID!, $input: UpdateModelInput!) {
    updateModel(id: $id, input: $input) {
      ...ModelFull
    }
  }
  ${MODEL_FULL_FRAGMENT}
`;

export const DELETE_MODEL = gql`
  mutation DeleteModel($id: ID!) {
    deleteModel(id: $id)
  }
`;
