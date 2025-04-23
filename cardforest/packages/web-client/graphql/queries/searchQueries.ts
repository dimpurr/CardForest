import { gql } from '@apollo/client';

export const SEARCH_ALL = gql`
  query SearchAll($query: String!, $limit: Int) {
    searchCards(query: $query, limit: $limit) {
      _id
      _key
      title
      content
      createdAt
      updatedAt
      model {
        _id
        name
      }
    }
    searchModels(query: $query, limit: $limit) {
      _id
      _key
      name
      system
      createdAt
    }
  }
`;

export const SEARCH_CARDS = gql`
  query SearchCards($query: String!, $limit: Int) {
    searchCards(query: $query, limit: $limit) {
      _id
      _key
      title
      content
      createdAt
      updatedAt
      model {
        _id
        name
      }
    }
  }
`;

export const SEARCH_MODELS = gql`
  query SearchModels($query: String!, $limit: Int) {
    searchModels(query: $query, limit: $limit) {
      _id
      _key
      name
      system
      createdAt
    }
  }
`;
