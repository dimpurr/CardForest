import { gql } from '@apollo/client';

export const USER_BASIC_FIELDS_FRAGMENT = gql`
  fragment UserBasicFields on User {
    _id
    _key
    username
    __typename
  }
`;

export const USER_FULL_FRAGMENT = gql`
  fragment UserFull on User {
    ...UserBasicFields
    createdAt
    updatedAt
    __typename
  }
  ${USER_BASIC_FIELDS_FRAGMENT}
`;
