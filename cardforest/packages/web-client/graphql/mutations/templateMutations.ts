import { gql } from '@apollo/client';

export const CREATE_TEMPLATE = gql`
  mutation CreateTemplate($input: CreateTemplateInput!) {
    createTemplate(input: $input) {
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

export const UPDATE_TEMPLATE = gql`
  mutation UpdateTemplate($id: ID!, $input: UpdateTemplateInput!) {
    updateTemplate(id: $id, input: $input) {
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

export const DELETE_TEMPLATE = gql`
  mutation DeleteTemplate($id: ID!) {
    deleteTemplate(id: $id)
  }
`;
