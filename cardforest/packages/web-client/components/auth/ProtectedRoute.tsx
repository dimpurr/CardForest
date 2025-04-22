import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Alert } from '@/components/ui/Alert';

interface ProtectedRouteProps {
  children: ReactNode;
  fallbackUrl?: string;
  loadingComponent?: ReactNode;
  title?: string;
}

/**
 * 路由保护组件
 * 用于保护需要认证的页面
 * 如果用户未登录，将重定向到登录页面
 */
export function ProtectedRoute({
  children,
  fallbackUrl = '/auth/signin',
  loadingComponent,
  title = 'Loading...'
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // 如果认证状态已加载完成且用户未认证，则重定向到登录页面
    if (!loading && !isAuthenticated) {
      const callbackUrl = encodeURIComponent(router.asPath);
      router.push(`${fallbackUrl}?callbackUrl=${callbackUrl}`);
    }
  }, [isAuthenticated, loading, router, fallbackUrl]);

  // 如果正在加载认证状态，显示加载组件
  if (loading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }
    
    return (
      <Layout title={title}>
        <div className="p-4 flex justify-center">
          <div className="animate-pulse">Checking authentication...</div>
        </div>
      </Layout>
    );
  }

  // 如果用户未认证，返回 null（将由 useEffect 中的重定向处理）
  if (!isAuthenticated) {
    return null;
  }

  // 如果用户已认证，渲染子组件
  return <>{children}</>;
}

/**
 * 带有错误处理的路由保护组件
 * 用于处理 API 错误，特别是认证错误
 */
export function ProtectedRouteWithErrorHandling({
  children,
  error,
  fallbackUrl = '/auth/signin',
  ...props
}: ProtectedRouteProps & { error?: Error | null }) {
  const router = useRouter();
  const isAuthError = error?.message === 'Forbidden resource' || 
                      error?.message === 'Unauthorized' ||
                      error?.message?.includes('not authenticated');

  // 如果是认证错误，显示错误信息并提供重新登录按钮
  if (error && isAuthError) {
    return (
      <Layout title="Authentication Error">
        <div className="p-6">
          <Alert variant="error">
            <Alert.Title>Session Expired</Alert.Title>
            <Alert.Description>
              Your session has expired or you don't have permission to access this resource.
              Please sign in again.
            </Alert.Description>
            <div className="mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => router.push(fallbackUrl)}
              >
                Sign in again
              </button>
            </div>
          </Alert>
        </div>
      </Layout>
    );
  }

  // 如果是其他错误，显示通用错误信息
  if (error) {
    return (
      <Layout title="Error">
        <div className="p-6">
          <Alert variant="error">
            <Alert.Title>Error</Alert.Title>
            <Alert.Description>{error.message}</Alert.Description>
          </Alert>
        </div>
      </Layout>
    );
  }

  // 如果没有错误，使用普通的路由保护组件
  return <ProtectedRoute fallbackUrl={fallbackUrl} {...props}>{children}</ProtectedRoute>;
}
