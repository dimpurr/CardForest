import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { Layout } from '@/components/Layout';
import { Alert } from '@/components/ui/Alert';
import { GET_MODEL_WITH_INHERITANCE } from '@/graphql/queries/modelQueries';
import { ModelEditor } from '@/components/model/ModelEditor';

export default function EditModelPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data, loading, error } = useQuery(GET_MODEL_WITH_INHERITANCE, {
    variables: { id },
    skip: !id,
  });

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

  if (!data?.model) {
    return (
      <Layout>
        <div className="p-6">
          <Alert variant="error">
            <Alert.Title>Model Not Found</Alert.Title>
            <Alert.Description>
              The model you are looking for does not exist.
            </Alert.Description>
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Edit Model</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Edit model details and fields
          </p>
        </div>
        <ModelEditor model={data.model} mode="edit" />
      </div>
    </Layout>
  );
}
