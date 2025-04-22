import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // 重定向到统一的登录页面
    router.replace('/auth/signin');
  }, [router]);

  // 返回一个空的加载状态，因为这个页面会立即重定向
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500">Redirecting to login page...</p>
    </div>
  );
}
