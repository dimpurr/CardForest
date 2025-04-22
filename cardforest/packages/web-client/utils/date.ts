/**
 * 格式化日期
 * @param dateString ISO 格式的日期字符串
 * @returns 格式化后的日期字符串
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  // 如果日期无效，返回原始字符串
  if (isNaN(date.getTime())) {
    return dateString;
  }
  
  // 使用 Intl.DateTimeFormat 格式化日期
  return new Intl.DateTimeFormat('default', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * 格式化日期和时间
 * @param dateString ISO 格式的日期字符串
 * @returns 格式化后的日期和时间字符串
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  
  // 如果日期无效，返回原始字符串
  if (isNaN(date.getTime())) {
    return dateString;
  }
  
  // 使用 Intl.DateTimeFormat 格式化日期和时间
  return new Intl.DateTimeFormat('default', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * 计算相对时间（例如：3 小时前）
 * @param dateString ISO 格式的日期字符串
 * @returns 相对时间字符串
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  
  // 如果日期无效，返回原始字符串
  if (isNaN(date.getTime())) {
    return dateString;
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // 使用 Intl.RelativeTimeFormat 格式化相对时间
  const rtf = new Intl.RelativeTimeFormat('default', { numeric: 'auto' });
  
  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return rtf.format(-diffInMinutes, 'minute');
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return rtf.format(-diffInHours, 'hour');
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return rtf.format(-diffInDays, 'day');
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return rtf.format(-diffInMonths, 'month');
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return rtf.format(-diffInYears, 'year');
}
