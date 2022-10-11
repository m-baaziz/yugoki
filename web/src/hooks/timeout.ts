import { useMemo } from 'react';

export type TimeoutWrapper = {
  timeout: ReturnType<typeof setTimeout> | undefined;
};

export function useTimeout() {
  const timeoutWrapper: TimeoutWrapper = useMemo(
    () => ({ timeout: undefined }),
    [],
  );
  return timeoutWrapper;
}
