import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_MODEL_WITH_INHERITANCE } from '@/graphql/queries/modelQueries';
import { Layout } from '@/components/Layout';
import { withAuth } from '@/components/auth';
import { PageState } from '@/components/ui/PageState';
import { Button } from '@/components/ui/Button';
import { ArrowLeftIcon, PencilIcon, DocumentPlusIcon } from '@heroicons/react/24/outline';
import { ModelBadge } from '@/components/model/ModelBadge';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/date';

function ModelDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data, loading, error } = useQuery(GET_MODEL_WITH_INHERITANCE, {
    variables: { id },
    skip: !id,
  });

  // 处理加载状态
  if (loading) {
    return (
      <Layout
        title="Model Details"
        breadcrumbs={[
          { label: 'Models', href: '/models' },
          { label: 'Loading...' }
        ]}
      >
        <PageState loading={true} loadingMessage="Loading model..." />
      </Layout>
    );
  }

  // 处理错误状态
  if (error) {
    return (
      <Layout
        title="Error"
        breadcrumbs={[
          { label: 'Models', href: '/models' },
          { label: 'Error' }
        ]}
      >
        <PageState 
          error={error} 
          retry={() => router.reload()}
        />
      </Layout>
    );
  }

  // 处理模型不存在的情况
  if (!data?.model) {
    return (
      <Layout
        title="Model Not Found"
        breadcrumbs={[
          { label: 'Models', href: '/models' },
          { label: 'Not Found' }
        ]}
      >
        <PageState 
          empty={true} 
          emptyMessage="The model you are looking for does not exist."
        >
          <div className="mt-4 flex justify-center">
            <Button 
              variant="primary" 
              onClick={() => router.push('/models')}
            >
              Back to Models
            </Button>
          </div>
        </PageState>
      </Layout>
    );
  }

  const { model, inheritedModels } = data;
  const modelName = model.name || 'Untitled Model';

  // 计算字段总数
  const totalFields = model.fields.reduce(
    (count, group) => count + (group.fields?.length || 0), 
    0
  );

  // 获取继承的模型名称
  const getInheritedModelName = (id: string) => {
    const inheritedModel = inheritedModels.find(m => m._id === `models/${id}`);
    return inheritedModel ? inheritedModel.name : id;
  };

  return (
    <Layout
      title={modelName}
      description={model.system ? 'System Model' : 'Custom Model'}
      breadcrumbs={[
        { label: 'Models', href: '/models' },
        { label: modelName }
      ]}
      actions={
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="flex items-center"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back
          </Button>
          
          {!model.system && (
            <Button 
              variant="outline" 
              onClick={() => router.push(`/models/${id}/edit`)}
              className="flex items-center"
            >
              <PencilIcon className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
          
          <Button 
            variant="primary" 
            onClick={() => router.push(`/cards/new?modelId=${id}`)}
            className="flex items-center"
          >
            <DocumentPlusIcon className="h-4 w-4 mr-1" />
            Create Card
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* 模型基本信息 */}
        <div className="card p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">{modelName}</h2>
              <div className="flex items-center space-x-2">
                {model.system && (
                  <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">
                    System Model
                  </Badge>
                )}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Created {formatDate(model.createdAt)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 模型统计信息 */}
            <div>
              <h3 className="text-lg font-medium mb-3">Model Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Total Fields:</span>
                  <span>{totalFields}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Inherited Models:</span>
                  <span>{model.inherits_from?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Type:</span>
                  <span>{model.system ? 'System' : 'Custom'}</span>
                </div>
              </div>
            </div>
            
            {/* 继承关系 */}
            {model.inherits_from && model.inherits_from.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">Inherits From</h3>
                <div className="space-y-2">
                  {model.inherits_from.map(parentId => (
                    <div 
                      key={parentId} 
                      className="p-2 bg-gray-50 dark:bg-gray-800 rounded flex justify-between items-center"
                    >
                      <span>{getInheritedModelName(parentId)}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => router.push(`/models/${parentId}`)}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* 字段列表 */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Fields</h3>
          
          {model.fields.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6 last:mb-0">
              <div className="flex items-center mb-2">
                <h4 className="text-md font-medium">
                  {group._inherit_from === '_self' 
                    ? 'Own Fields' 
                    : `Fields from ${getInheritedModelName(group._inherit_from)}`}
                </h4>
                {group._inherit_from !== '_self' && (
                  <Badge className="ml-2 text-xs">Inherited</Badge>
                )}
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Required
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {group.fields.map((field, fieldIndex) => (
                      <tr key={fieldIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {field.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {field.type}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {field.required ? 'Yes' : 'No'}
                        </td>
                      </tr>
                    ))}
                    {group.fields.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                          No fields in this group
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(ModelDetailPage);
