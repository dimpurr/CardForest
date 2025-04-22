import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Layout } from '@/components/Layout';
import { useRouter } from 'next/router';

export default function SignIn() {
  const router = useRouter();
  const { callbackUrl } = router.query;

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">CardForest Login</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Frontend Login</h2>
            <p className="mb-4 text-gray-600">
              Use NextAuth to authenticate with GitHub. This is the recommended method.
            </p>
            <Button 
              variant="primary" 
              onClick={() => signIn('github', { callbackUrl: callbackUrl as string || '/cards' })}
            >
              Sign in with GitHub (Frontend)
            </Button>
          </div>
          
          <div className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Backend Login</h2>
            <p className="mb-4 text-gray-600">
              Authenticate directly with the backend server. Use this if frontend login doesn't work.
            </p>
            <a 
              href="http://localhost:3030/user/auth/github" 
              className="inline-block px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              Sign in with GitHub (Backend)
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
