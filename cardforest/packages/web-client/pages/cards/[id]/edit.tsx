import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { Layout } from '@/components/Layout';
import { GET_CARD } from '@/graphql/queries/cardQueries';
import { CardEditor } from '@/components/card/CardEditor';
import { withAuth } from '@/components/auth';

function EditCardPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data, loading, error } = useQuery(GET_CARD, {
    variables: { id },
    skip: !id,
  });

  if (loading) {
    return (
      <Layout
        title="Loading Card"
        breadcrumbs={[
          { label: 'Cards', href: '/cards' },
          { label: 'Loading...' }
        ]}
      >
        <div className="p-6 flex justify-center">
          <div className="animate-pulse">Loading card...</div>
        </div>
      </Layout>
    );
  }

  if (!data?.card) {
    return (
      <Layout
        title="Card Not Found"
        breadcrumbs={[
          { label: 'Cards', href: '/cards' },
          { label: 'Not Found' }
        ]}
      >
        <div className="p-6 text-center">
          <p className="text-red-500">The card you are looking for does not exist.</p>
          <button
            onClick={() => router.push('/cards')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Cards
          </button>
        </div>
      </Layout>
    );
  }

  const cardTitle = data.card.title || 'Card';

  return (
    <Layout
      title={`Edit ${cardTitle}`}
      description="Edit card details"
      breadcrumbs={[
        { label: 'Cards', href: '/cards' },
        { label: cardTitle },
        { label: 'Edit' }
      ]}
    >
      <div className="p-4">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="mr-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            ← Back
          </button>
        </div>
        <CardEditor mode="edit" card={data.card} />
      </div>
    </Layout>
  );
}

export default withAuth(EditCardPage, { handleErrors: true });
