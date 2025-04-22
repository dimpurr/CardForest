import { ComponentType } from 'react';
import { ProtectedRoute, ProtectedRouteWithErrorHandling } from './ProtectedRoute';

/**
 * 高阶组件，用于包装需要认证的页面
 * @param Component 需要包装的组件
 * @param options 配置选项
 * @returns 包装后的组件
 */
export function withAuth<P extends object>(
  Component: ComponentType<P>,
  options: {
    fallbackUrl?: string;
    handleErrors?: boolean;
  } = {}
) {
  const { fallbackUrl = '/auth/signin', handleErrors = false } = options;

  // 创建包装组件
  const WithAuthComponent = (props: P & { error?: Error | null }) => {
    // 如果需要处理错误，使用带错误处理的路由保护组件
    if (handleErrors) {
      return (
        <ProtectedRouteWithErrorHandling fallbackUrl={fallbackUrl} error={props.error}>
          <Component {...props} />
        </ProtectedRouteWithErrorHandling>
      );
    }

    // 否则使用普通的路由保护组件
    return (
      <ProtectedRoute fallbackUrl={fallbackUrl}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };

  // 设置组件名称，方便调试
  WithAuthComponent.displayName = `withAuth(${Component.displayName || Component.name || 'Component'})`;

  return WithAuthComponent;
}

export default withAuth;
