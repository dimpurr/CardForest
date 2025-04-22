import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Layout } from '@/components/Layout';
import { useRouter } from 'next/router';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/contexts/AuthContext';

export default function SignIn() {
  const router = useRouter();
  const { callbackUrl } = router.query;
  const { data: session, status } = useSession();
  const { isAuthenticated, login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // 如果已经登录，重定向到回调URL或卡片页面
  useEffect(() => {
    if (isAuthenticated) {
      router.push(callbackUrl as string || '/cards');
    }
  }, [isAuthenticated, router, callbackUrl]);

  // 处理前端登录
  const handleFrontendLogin = async () => {
    try {
      await login('github', false, callbackUrl as string || '/cards');
    } catch (err) {
      setError('Frontend login failed. Please try the backend login option.');
      console.error('Frontend login error:', err);
    }
  };

  // 处理后端登录
  const handleBackendLogin = () => {
    login('github', true, callbackUrl as string || '/cards');
  };

  // 如果正在加载会话，显示加载状态
  if (status === 'loading') {
    return (
      <Layout>
        <div className="p-6">
          <Alert>
            <Alert.Description>Checking authentication status...</Alert.Description>
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">CardForest Login</h1>

        {error && (
          <Alert variant="error" className="mb-6">
            <Alert.Description>{error}</Alert.Description>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Frontend Login</h2>
            <p className="mb-4 text-gray-600">
              Use NextAuth to authenticate with GitHub. This is the recommended method for normal use.
            </p>
            <Button
              variant="primary"
              onClick={handleFrontendLogin}
            >
              Sign in with GitHub (Frontend)
            </Button>
          </div>

          <div className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Backend Login</h2>
            <p className="mb-4 text-gray-600">
              Authenticate directly with the backend server. Use this for API debugging or if frontend login doesn't work.
            </p>
            <Button
              variant="secondary"
              onClick={handleBackendLogin}
            >
              Sign in with GitHub (Backend)
            </Button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-lg font-medium mb-2">About Authentication</h3>
          <p className="text-gray-600 dark:text-gray-400">
            CardForest supports two authentication methods:
          </p>
          <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-400">
            <li><strong>Frontend Auth</strong>: Uses NextAuth for a seamless experience. Recommended for normal use.</li>
            <li><strong>Backend Auth</strong>: Connects directly to the backend API. Useful for debugging or when you need direct API access.</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
