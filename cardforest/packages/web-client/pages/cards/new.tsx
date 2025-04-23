import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_MODEL_WITH_INHERITANCE } from '@/graphql/queries/modelQueries';
import { CardEditor } from '@/components/card/CardEditor';
import { getModelFullId } from '@/utils/modelUtils';
import { Layout } from '@/components/Layout';
import { DebugPanel } from '@/components/debug/DebugPanel';
import { withAuth } from '@/components/auth';
import { PageState } from '@/components/ui/PageState';
import { Button } from '@/components/ui/Button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

function NewCardPage() {
  const router = useRouter();
  const { modelId } = router.query;

  // 如果没有选择模型，重定向到卡片列表页面
  if (!modelId && typeof window !== 'undefined') {
    router.replace('/cards');
    return null;
  }

  const { data, loading, error } = useQuery(GET_MODEL_WITH_INHERITANCE, {
    variables: { id: getModelFullId(modelId as string) },
    skip: !modelId,
  });

  // 处理加载状态
  if (loading) {
    return (
      <Layout
        title="Create New Card"
        breadcrumbs={[
          { label: 'Cards', href: '/cards' },
          { label: 'Create New Card' }
        ]}
      >
        <PageState loading={true} loadingMessage="Loading model..." />
      </Layout>
    );
  }

  // 处理错误状态
  if (error || !data?.model) {
    return (
      <Layout
        title="Error"
        breadcrumbs={[
          { label: 'Cards', href: '/cards' },
          { label: 'Error' }
        ]}
      >
        <PageState
          error={error || new Error('Failed to load model')}
          retry={() => router.reload()}
        />
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

  return (
    <Layout
      title="Create New Card"
      description={`Create a new ${model.name} card`}
      breadcrumbs={[
        { label: 'Cards', href: '/cards' },
        { label: 'Create New Card' }
      ]}
      actions={
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back
        </Button>
      }
    >
      {/* 调试面板 - 仅在开发环境和调试模式下显示 */}
      {process.env.NODE_ENV === 'development' && router.query.debug === 'true' && (
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
    </Layout>
  );
}

export default withAuth(NewCardPage, { handleErrors: true });
