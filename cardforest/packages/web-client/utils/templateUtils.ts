import { Template } from '@/types/template';

export function getTemplateId(id: string | undefined | null): string {
  if (!id) return '';
  return id.startsWith('templates/') ? id : `templates/${id}`;
}

export function getTemplateFullId(id: string | undefined | null): string {
  return getTemplateId(id);
}

export function getInheritedFields(template: any): any[] {
  if (!template?.fields) return [];
  const result: any[] = [];
  
  template.fields.forEach((group: any) => {
    if (group._inherit_from !== '_self') {
      result.push(...(group.fields || []));
    }
  });
  
  return result;
}

export function getOwnFields(template: any): any[] {
  if (!template?.fields) return [];
  const result: any[] = [];
  
  template.fields.forEach((group: any) => {
    if (group._inherit_from === '_self') {
      result.push(...(group.fields || []));
    }
  });
  
  return result;
}

export function getFieldCount(template: any): number {
  if (!template?.fields) return 0;
  return template.fields.reduce((count: number, group: any) => {
    return count + (group.fields?.length || 0);
  }, 0);
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
