import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { Layout } from '@/components/Layout';
import { Alert } from '@/components/ui/alert';
import { GET_TEMPLATE_WITH_INHERITANCE } from '@/graphql/queries/templateQueries';
import { CardEditor } from '@/components/card/CardEditor';

export default function NewCardPage() {
  const router = useRouter();
  const { templateId } = router.query;

  const { data, loading, error } = useQuery(GET_TEMPLATE_WITH_INHERITANCE, {
    variables: { id: templateId },
    skip: !templateId,
  });

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

  if (!data?.template) {
    return (
      <Layout>
        <div className="p-6">
          <Alert variant="error">
            <Alert.Title>Template Not Found</Alert.Title>
            <Alert.Description>
              The template you selected does not exist.
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
          <h1 className="text-2xl font-bold">Create New Card</h1>
          <span className="ml-2 text-gray-600">
            using template: {data.template.name}
          </span>
        </div>
        <CardEditor mode="create" template={data.template} />
      </div>
    </Layout>
  );
}
