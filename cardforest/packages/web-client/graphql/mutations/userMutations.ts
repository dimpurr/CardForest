import { gql } from '@apollo/client';
import { USER_FULL_FRAGMENT } from '../fragments/userFragments';

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        ...UserFull
      }
    }
  }
  ${USER_FULL_FRAGMENT}
`;

export const REGISTER = gql`
  mutation Register($username: String!, $password: String!) {
    register(username: $username, password: $password) {
      ...UserFull
    }
  }
  ${USER_FULL_FRAGMENT}
`;
