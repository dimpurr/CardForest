import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_MODEL_WITH_INHERITANCE } from '@/graphql/queries/modelQueries';
import { CardEditor } from '@/components/card/CardEditor';
import { Alert } from '@/components/ui/Alert';
import { getModelFullId } from '@/utils/modelUtils';
import { Layout } from '@/components/Layout';
import { DebugPanel } from '@/components/debug/DebugPanel';
import { withAuth } from '@/components/auth';

function NewCardPage() {
  const router = useRouter();
  const { modelId } = router.query;

  const { data, loading, error } = useQuery(GET_MODEL_WITH_INHERITANCE, {
    variables: { id: getModelFullId(modelId as string) },
    skip: !modelId,
  });

  if (!modelId) {
    return (
      <Layout>
        <div className="p-6">
          <Alert variant="error">
            <Alert.Title>Error</Alert.Title>
            <Alert.Description>No model selected. Please select a model first.</Alert.Description>
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
            <Alert.Description>Loading model...</Alert.Description>
          </Alert>
        </div>
      </Layout>
    );
  }

  if (error || !data?.model) {
    return (
      <Layout>
        <div className="p-6">
          <Alert variant="error">
            <Alert.Title>Error</Alert.Title>
            <Alert.Description>
              {error ? error.message : 'Failed to load model'}
            </Alert.Description>
          </Alert>
        </div>
      </Layout>
    );
  }

  const { model, inheritedModels } = data;

  // 处理模板继承
  const processedModel = {
    ...model,
    fields: [
      // 首先添加当前模板的字段
      ...model.fields.map(group => ({
        ...group,
        _inherit_from: '_self'  // 将当前模板的字段标记为 _self
      })),
      // 然后添加继承的字段
      ...model.fields
        .filter(group => group._inherit_from !== '_self')
        .map(group => {
          const inheritedModel = inheritedModels.find(
            t => t._id === `models/${group._inherit_from}`
          );
          if (inheritedModel) {
            return {
              ...group,
              fields: inheritedModel.fields
                .filter(g => g._inherit_from === '_self')
                .flatMap(g => g.fields || []),
              _inherit_from: group._inherit_from  // 保持原有的 _inherit_from
            };
          }
          return group;
        })
    ]
  };

  console.log('Final model:', JSON.stringify(processedModel, null, 2));

  return (
    <Layout
      title="Create New Card"
      description={`Create a new ${model.name || 'card'}`}
      breadcrumbs={[
        { label: 'Cards', href: '/cards' },
        { label: 'Create New Card' }
      ]}
    >
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="mr-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            ← Back
          </button>
        </div>

        {router.query.debug === 'true' && (
          <DebugPanel
            title="Model Data"
            data={{
              original: {
                model: {
                  _id: model._id,
                  fields: model.fields,
                },
                inheritedModels: inheritedModels.map((t: any) => ({
                  _id: t._id,
                  fields: t.fields,
                })),
              },
              processed: {
                fields: processedModel.fields,
              },
            }}
          />
        )}

        <CardEditor model={processedModel} mode="create" />
      </div>
    </Layout>
  );
}

export default withAuth(NewCardPage, { handleErrors: true });
