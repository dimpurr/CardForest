import { Model } from '@/types/model';

export function getModelId(id: string | undefined | null): string {
  if (!id) return '';
  return id.startsWith('models/') ? id : `models/${id}`;
}

export function getModelFullId(id: string | undefined | null): string {
  return getModelId(id);
}

export function getInheritedFields(model: any): any[] {
  if (!model?.fields) return [];
  const result: any[] = [];
  
  model.fields.forEach((group: any) => {
    if (group._inherit_from !== '_self') {
      result.push(...(group.fields || []));
    }
  });
  
  return result;
}

export function getOwnFields(model: any): any[] {
  if (!model?.fields) return [];
  const result: any[] = [];
  
  model.fields.forEach((group: any) => {
    if (group._inherit_from === '_self') {
      result.push(...(group.fields || []));
    }
  });
  
  return result;
}

export function getFieldCount(model: any): number {
  if (!model?.fields) return 0;
  return model.fields.reduce((count: number, group: any) => {
    return count + (group.fields?.length || 0);
  }, 0);
}

export function getInheritedFieldsByModel(model: Model, models?: Model[]) {
  const result: { modelId: string; modelName: string; fields: any[] }[] = [];
  
  model.fields
    .filter(group => group._inherit_from !== '_self')
    .forEach(group => {
      if (models) {
        const inheritedModel = models.find(
          t => t._id === getModelFullId(group._inherit_from)
        );
        if (inheritedModel) {
          const fields = inheritedModel.fields
            .filter(g => g._inherit_from === '_self')
            .flatMap(g => g.fields || []);
          result.push({
            modelId: group._inherit_from,
            modelName: inheritedModel.name,
            fields
          });
        }
      }
    });

  return result;
}
