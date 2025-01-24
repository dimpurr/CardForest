import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_TEMPLATE_WITH_INHERITANCE } from '@/graphql/queries/templateQueries';
import { CardEditor } from '@/components/card/CardEditor';
import { Alert } from '@/components/ui/alert';
import { getTemplateFullId } from '@/utils/templateUtils';
import { Layout } from '@/components/Layout';

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

  // 处理继承的字段
  const template = data.template;
  const inheritedTemplates = data.inheritedTemplates || [];

  // 将继承的字段添加到模板中
  template.fields = template.fields.map((group: any) => {
    if (group._inherit_from !== '_self') {
      const inheritedTemplate = inheritedTemplates.find(
        (t: any) => t._id === `templates/${group._inherit_from}`
      );
      if (inheritedTemplate) {
        return {
          ...group,
          fields: inheritedTemplate.fields
            .filter((g: any) => g._inherit_from === '_self')
            .flatMap((g: any) => g.fields)
        };
      }
    }
    return group;
  });

  return (
    <Layout>
      <div className="p-4">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="mr-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold">Create New Card</h1>
          <span className="ml-2 text-gray-600">
            using template: {data.template.name}
          </span>
        </div>
        <CardEditor template={template} mode="create" />
      </div>
    </Layout>
  );
}
