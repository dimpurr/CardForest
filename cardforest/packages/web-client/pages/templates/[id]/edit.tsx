import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { Layout } from '@/components/Layout';
import { Alert } from '@/components/ui/Alert';
import { GET_TEMPLATE_WITH_INHERITANCE } from '@/graphql/queries/templateQueries';
import { TemplateEditor } from '@/components/template/TemplateEditor';

export default function EditTemplatePage() {
  const router = useRouter();
  const { id } = router.query;

  const { data, loading, error } = useQuery(GET_TEMPLATE_WITH_INHERITANCE, {
    variables: { id },
    skip: !id,
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
              The template you are looking for does not exist.
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
          <h1 className="text-2xl font-bold">Edit Template</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Edit template details and fields
          </p>
        </div>
        <TemplateEditor template={data.template} mode="edit" />
      </div>
    </Layout>
  );
}
