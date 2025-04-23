import { useRouter } from 'next/router';
import { ModelList } from '@/components/model/ModelList';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { withAuth } from '@/components/auth';
import { PlusIcon } from '@heroicons/react/24/outline';

function ModelsPage() {
  const router = useRouter();

  // 处理创建模型按钮点击
  const handleCreateModel = () => {
    router.push('/models/new');
  };

  return (
    <Layout
      title="Models"
      description="Create and manage your card models"
      breadcrumbs={[
        { label: 'Models' }
      ]}
      actions={
        <Button
          variant="primary"
          onClick={handleCreateModel}
          className="flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Create Model
        </Button>
      }
    >
      <ModelList />
    </Layout>
  );
}

export default withAuth(ModelsPage);
