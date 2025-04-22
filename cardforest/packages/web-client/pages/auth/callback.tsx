import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/Layout';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthCallback() {
  const router = useRouter();
  const { token } = router.query;
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    if (!router.isReady) return;

    // 获取回调URL，默认为卡片页面
    const redirectTo = router.query.callbackUrl as string || '/cards';

    // 如果URL中有token参数，则已经由后端认证服务处理过
    // token会被AuthService自动从URL参数中获取并存储到cookie中
    if (token) {
      setStatus('success');
      setMessage(`Authentication successful! Redirecting to ${redirectTo}...`);

      // 短暂延迟后重定向到指定页面
      const timer = setTimeout(() => {
        router.push(redirectTo);
      }, 1500);

      return () => clearTimeout(timer);
    } else if (isAuthenticated) {
      // 如果已经认证但没有token参数，可能是通过其他方式登录的
      setStatus('success');
      setMessage(`Already authenticated! Redirecting to ${redirectTo}...`);

      const timer = setTimeout(() => {
        router.push(redirectTo);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      // 如果没有token参数且未认证，则认证失败
      setStatus('error');
      setMessage('Authentication failed. Please try again.');
      console.error('Authentication failed: No token and not authenticated');
    }
  }, [router, token, isAuthenticated]);

  return (
    <Layout>
      <div className="p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">Authentication {status === 'success' ? 'Successful' : status === 'error' ? 'Failed' : 'Processing'}</h1>

        <Alert variant={status === 'loading' ? 'default' : status === 'success' ? 'success' : 'error'}>
          <Alert.Description>{message}</Alert.Description>
        </Alert>

        {status === 'error' && (
          <div className="mt-6">
            <Button variant="primary" onClick={() => router.push('/auth/signin')}>
              Return to Login
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
