import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { Layout } from '@/components/Layout';
import { Alert } from '@/components/ui/Alert';
import { GET_CARD } from '@/graphql/queries/cardQueries';
import { CardEditor } from '@/components/card/CardEditor';

export default function EditCardPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data, loading, error } = useQuery(GET_CARD, {
    variables: { id },
    skip: !id,
  });

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <Alert>
            <Alert.Description>Loading card...</Alert.Description>
          </Alert>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-6">
          <Alert variant="error">
            <Alert.Title>Error</Alert.Title>
            <Alert.Description>{error.message}</Alert.Description>
          </Alert>
        </div>
      </Layout>
    );
  }

  if (!data?.card) {
    return (
      <Layout>
        <div className="p-6">
          <Alert variant="error">
            <Alert.Title>Card Not Found</Alert.Title>
            <Alert.Description>
              The card you are looking for does not exist.
            </Alert.Description>
          </Alert>
        </div>
      </Layout>
    );
  }

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
          <h1 className="text-2xl font-bold">Edit Card</h1>
        </div>
        <CardEditor mode="edit" card={data.card} />
      </div>
    </Layout>
  );
}
