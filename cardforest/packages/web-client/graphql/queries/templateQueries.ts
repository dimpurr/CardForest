import { gql } from '@apollo/client';

export const TEMPLATE_FIELDS_FRAGMENT = gql`
  fragment TemplateFields on FlattenedTemplate {
    _id
    name
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
`;

export const GET_TEMPLATES = gql`
  query GetTemplates {
    templates {
      ...TemplateFields
    }
  }
  ${TEMPLATE_FIELDS_FRAGMENT}
`;

export const GET_TEMPLATE = gql`
  query GetTemplate($id: ID!) {
    template(id: $id) {
      ...TemplateFields
    }
  }
  ${TEMPLATE_FIELDS_FRAGMENT}
`;

export const GET_TEMPLATE_WITH_INHERITANCE = gql`
  query GetTemplateWithInheritance($id: ID!) {
    template(id: $id) {
      ...TemplateFields
      flattenedFields {
        name
        type
        required
        default
        sourceTemplate
      }
    }
  }
  ${TEMPLATE_FIELDS_FRAGMENT}
`;
