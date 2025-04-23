import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { Layout } from '@/components/Layout';
import { GET_CARD } from '@/graphql/queries/cardQueries';
import { CardEditor } from '@/components/card/CardEditor';
import { withAuth } from '@/components/auth';
import { PageState } from '@/components/ui/PageState';
import { Button } from '@/components/ui/Button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

function EditCardPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data, loading, error } = useQuery(GET_CARD, {
    variables: { id },
    skip: !id,
  });

  // 处理加载状态
  if (loading) {
    return (
      <Layout
        title="Edit Card"
        breadcrumbs={[
          { label: 'Cards', href: '/cards' },
          { label: 'Loading...' }
        ]}
      >
        <PageState loading={true} loadingMessage="Loading card..." />
      </Layout>
    );
  }

  // 处理错误状态
  if (error) {
    return (
      <Layout
        title="Error"
        breadcrumbs={[
          { label: 'Cards', href: '/cards' },
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

  // 处理卡片不存在的情况
  if (!data?.card) {
    return (
      <Layout
        title="Card Not Found"
        breadcrumbs={[
          { label: 'Cards', href: '/cards' },
          { label: 'Not Found' }
        ]}
      >
        <PageState
          empty={true}
          emptyMessage="The card you are looking for does not exist."
        >
          <div className="mt-4 flex justify-center">
            <Button
              variant="primary"
              onClick={() => router.push('/cards')}
            >
              Back to Cards
            </Button>
          </div>
        </PageState>
      </Layout>
    );
  }

  const cardTitle = data.card.title || 'Untitled Card';

  return (
    <Layout
      title={`Edit ${cardTitle}`}
      description="Edit card details"
      breadcrumbs={[
        { label: 'Cards', href: '/cards' },
        { label: cardTitle, href: `/cards/${id}` },
        { label: 'Edit' }
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
      <CardEditor mode="edit" card={data.card} />
    </Layout>
  );
}

export default withAuth(EditCardPage, { handleErrors: true });
