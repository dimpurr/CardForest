import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_TEMPLATE_WITH_INHERITANCE } from '@/graphql/queries/templateQueries';
import { CardEditor } from '@/components/card/CardEditor';
import { Alert } from '@/components/ui/alert';
import { getTemplateFullId } from '@/utils/templateUtils';
import { Layout } from '@/components/Layout';
import { DebugPanel } from '@/components/debug/DebugPanel';

export default function NewCardPage() {
  const router = useRouter();
  const { templateId } = router.query;

  const { data, loading, error } = useQuery(GET_TEMPLATE_WITH_INHERITANCE, {
    variables: { id: getTemplateFullId(templateId as string) },
    skip: !templateId,
  });

  if (!templateId) {
    return (
      <Layout>
        <div className="p-6">
          <Alert variant="error">
            <Alert.Title>Error</Alert.Title>
            <Alert.Description>No template selected. Please select a template first.</Alert.Description>
          </Alert>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <Alert>
            <Alert.Description>Loading template...</Alert.Description>
          </Alert>
        </div>
      </Layout>
    );
  }

  if (error || !data?.template) {
    return (
      <Layout>
        <div className="p-6">
          <Alert variant="error">
            <Alert.Title>Error</Alert.Title>
            <Alert.Description>
              {error ? error.message : 'Failed to load template'}
            </Alert.Description>
          </Alert>
        </div>
      </Layout>
    );
  }

  const { template, inheritedTemplates } = data;

  // 处理模板继承
  const processedTemplate = {
    ...template,
    fields: [
      // 首先添加当前模板的字段
      ...template.fields.map(group => ({
        ...group,
        _inherit_from: '_self'  // 将当前模板的字段标记为 _self
      })),
      // 然后添加继承的字段
      ...template.fields
        .filter(group => group._inherit_from !== '_self')
        .map(group => {
          const inheritedTemplate = inheritedTemplates.find(
            t => t._id === `templates/${group._inherit_from}`
          );
          if (inheritedTemplate) {
            return {
              ...group,
              fields: inheritedTemplate.fields
                .filter(g => g._inherit_from === '_self')
                .flatMap(g => g.fields || []),
              _inherit_from: group._inherit_from  // 保持原有的 _inherit_from
            };
          }
          return group;
        })
    ]
  };

  console.log('Final template:', JSON.stringify(processedTemplate, null, 2));

  return (
    <Layout>
      <div className="p-6">
        <DebugPanel
          title="Template Data"
          data={{
            original: {
              template: {
                _id: template._id,
                fields: template.fields,
              },
              inheritedTemplates: inheritedTemplates.map((t: any) => ({
                _id: t._id,
                fields: t.fields,
              })),
            },
            processed: {
              fields: processedTemplate.fields,
            },
          }}
        />
        <CardEditor template={processedTemplate} mode="create" />
      </div>
    </Layout>
  );
}
