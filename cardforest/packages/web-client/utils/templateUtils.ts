import { Template } from '@/types/template';

export function getTemplateId(template: Template | string | undefined | null) {
  if (!template) return undefined;
  if (typeof template === 'string') {
    return template.includes('templates/') ? template.split('/')[1] : template;
  }
  return template._id.split('/')[1];
}

export function getTemplateFullId(id: string | undefined | null) {
  if (!id) return undefined;
  return id.includes('templates/') ? id : `templates/${id}`;
}

export function getInheritedFields(template: Template, templates?: Template[]) {
  const allFields: any[] = [];
  
  if (!template || !template.fields) return allFields;

  template.fields.forEach(group => {
    if (group._inherit_from === '_self') {
      allFields.push(...(group.fields || []));
    } else if (templates) {
      const inheritedTemplate = templates.find(
        t => t._id === getTemplateFullId(group._inherit_from)
      );
      if (inheritedTemplate) {
        const inheritedFields = inheritedTemplate.fields
          .filter(g => g._inherit_from === '_self')
          .flatMap(g => g.fields || []);
        allFields.push(...inheritedFields);
      }
    }
  });

  return allFields;
}

export function getFieldCount(template: Template, templates?: Template[]) {
  return getInheritedFields(template, templates).length;
}

export function getOwnFields(template: Template) {
  return template.fields
    .filter(group => group._inherit_from === '_self')
    .flatMap(group => group.fields || []);
}

export function getInheritedFieldsByTemplate(template: Template, templates?: Template[]) {
  const result: { templateId: string; templateName: string; fields: any[] }[] = [];
  
  template.fields
    .filter(group => group._inherit_from !== '_self')
    .forEach(group => {
      if (templates) {
        const inheritedTemplate = templates.find(
          t => t._id === getTemplateFullId(group._inherit_from)
        );
        if (inheritedTemplate) {
          const fields = inheritedTemplate.fields
            .filter(g => g._inherit_from === '_self')
            .flatMap(g => g.fields || []);
          result.push({
            templateId: group._inherit_from,
            templateName: inheritedTemplate.name,
            fields
          });
        }
      }
    });

  return result;
}
