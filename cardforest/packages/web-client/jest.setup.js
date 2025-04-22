// 添加 Jest 扩展匹配器
import '@testing-library/jest-dom';

// 模拟 next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  }),
}));

// 模拟 next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// 模拟 Intl.RelativeTimeFormat
if (!Intl.RelativeTimeFormat) {
  Intl.RelativeTimeFormat = class {
    constructor() {}
    format(value, unit) {
      return `${value} ${unit} ago`;
    }
  };
}

// 全局模拟
global.fetch = jest.fn();
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};
