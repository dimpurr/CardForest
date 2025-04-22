import { gql } from '@apollo/client';

export const MODEL_BASIC_FIELDS_FRAGMENT = gql`
  fragment ModelBasicFields on Model {
    _id
    _key
    name
    createdAt
    updatedAt
    __typename
  }
`;

export const MODEL_FIELD_FRAGMENT = gql`
  fragment ModelField on FieldDefinition {
    name
    type
    required
    default
    config
    __typename
  }
`;

export const MODEL_FIELDS_FRAGMENT = gql`
  fragment ModelFields on Model {
    ...ModelBasicFields
    fields {
      _inherit_from
      fields {
        ...ModelField
      }
      __typename
    }
    __typename
  }
  ${MODEL_BASIC_FIELDS_FRAGMENT}
  ${MODEL_FIELD_FRAGMENT}
`;

export const MODEL_FULL_FRAGMENT = gql`
  fragment ModelFull on Model {
    ...ModelFields
    inherits_from
    system
    createdBy
    __typename
  }
  ${MODEL_FIELDS_FRAGMENT}
`;
