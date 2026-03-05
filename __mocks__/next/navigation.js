export const useRouter = () => ({
  replace: jest.fn(),
  push: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
});

export const usePathname = () => "/";

export const useSearchParams = () => ({
  get: jest.fn(() => null),
});
