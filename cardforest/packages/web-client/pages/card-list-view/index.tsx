import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { TableProvider } from '@/components/card-list-view/TableProvider';
import { Table } from '@/components/card-list-view/Table';
import { useSession } from 'next-auth/react';
import { useQuery, gql } from '@apollo/client';
import { useJWT } from '@/hooks/useJWT';
import { useAtom } from 'jotai';
import { cardsAtom, sortedCardsAtom } from '@/store/cards';
import { Layout } from '@/components/Layout';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { signIn } from 'next-auth/react';

const GET_MY_CARDS = gql`
  query GetMyCards {
    myCards {
      _id
      title
      content
      createdAt
      createdBy {
        username
      }
    }
  }
`;

interface Card {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: {
    username: string;
  };
}

export default function CardListView() {
  const { data: session, status: sessionStatus } = useSession();
  const { jwt, isAuthenticated, status: jwtStatus } = useJWT();
  const [, setCards] = useAtom(cardsAtom);
  const [sortedCards] = useAtom(sortedCardsAtom);

  const { loading, error, data } = useQuery(GET_MY_CARDS, {
    skip: !isAuthenticated,
    onCompleted: (data) => {
      if (data?.myCards) {
        setCards(data.myCards);
      }
    },
  });

  // 列定义
  const columns = useMemo<ColumnDef<Card>[]>(
    () => [
      {
        accessorKey: '_id',
        header: 'ID',
        size: 100,
      },
      {
        accessorKey: 'title',
        header: 'Title',
        size: 200,
      },
      {
        accessorKey: 'content',
        header: 'Content',
        size: 300,
      },
      {
        accessorKey: 'createdAt',
        header: 'Created At',
        size: 150,
        cell: (info) => new Date(info.getValue() as string).toLocaleString(),
      },
      {
        accessorFn: (row) => row.createdBy?.username,
        header: 'Created By',
        size: 150,
      },
    ],
    []
  );

  if (sessionStatus === 'loading' || jwtStatus === 'loading') {
    return (
      <Layout>
        <div className="p-6">
          <Alert>
            <Alert.Description>Loading session...</Alert.Description>
          </Alert>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return (
      <Layout>
        <div className="p-6">
          <Alert>
            <Alert.Title>Not Signed In</Alert.Title>
            <Alert.Description>
              Please sign in to view your cards.
            </Alert.Description>
            <div className="mt-4">
              <Button variant="primary" onClick={() => signIn('github')}>
                Sign in with GitHub
              </Button>
            </div>
          </Alert>
        </div>
      </Layout>
    );
  }

  const showError = error && session;
  const isAuthError = error?.message === 'Forbidden resource';

  if (showError && isAuthError) {
    return (
      <Layout>
        <div className="p-6">
          <Alert variant="error">
            <Alert.Title>Session Expired</Alert.Title>
            <Alert.Description>
              Your session has expired. Please sign in again.
            </Alert.Description>
            <div className="mt-4">
              <Button variant="primary" onClick={() => signIn('github')}>
                Sign in with GitHub
              </Button>
            </div>
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
            <Alert.Description>Loading cards...</Alert.Description>
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

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Card List View</h1>
        <div className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <TableProvider data={sortedCards} columns={columns}>
            {(table) => <Table table={table} />}
          </TableProvider>
        </div>
      </div>
    </Layout>
  );
}
