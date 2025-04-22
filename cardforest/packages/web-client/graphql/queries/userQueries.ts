import { gql } from '@apollo/client';
import { USER_BASIC_FIELDS_FRAGMENT, USER_FULL_FRAGMENT } from '../fragments/userFragments';

export const GET_ME = gql`
  query GetMe {
    me {
      ...UserFull
    }
  }
  ${USER_FULL_FRAGMENT}
`;
