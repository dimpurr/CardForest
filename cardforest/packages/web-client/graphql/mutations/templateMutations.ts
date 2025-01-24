import { gql } from '@apollo/client';
import { TEMPLATE_FIELDS_FRAGMENT } from '../queries/templateQueries';

export const CREATE_TEMPLATE = gql`
  mutation CreateTemplate($input: CreateTemplateInput!) {
    createTemplate(input: $input) {
      ...TemplateFields
    }
  }
  ${TEMPLATE_FIELDS_FRAGMENT}
`;

export const UPDATE_TEMPLATE = gql`
  mutation UpdateTemplate($id: ID!, $input: UpdateTemplateInput!) {
    updateTemplate(id: $id, input: $input) {
      ...TemplateFields
    }
  }
  ${TEMPLATE_FIELDS_FRAGMENT}
`;

export const DELETE_TEMPLATE = gql`
  mutation DeleteTemplate($id: ID!) {
    deleteTemplate(id: $id)
  }
`;
