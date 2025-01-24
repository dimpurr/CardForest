import { gql } from '@apollo/client';

export const GET_MY_CARDS = gql`
  query GetMyCards {
    myCards {
      _id
      title
      content
      createdAt
      createdBy {
        username
      }
    }
  }
`;

export const GET_TEMPLATES = gql`
  query GetTemplates {
    templates {
      _id
      _key
      name
    }
  }
`;

export const GET_TEMPLATE_BY_ID = gql`
  query GetTemplateById($id: ID!) {
    template(id: $id) {
      _id
      _key
      name
      fields
      createdAt
      updatedAt
    }
  }
`;
