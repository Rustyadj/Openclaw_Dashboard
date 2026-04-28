import { useCallback, useEffect, useMemo, useState, type DependencyList } from 'react';

export type AsyncState<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
};

export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList = [], options: { immediate?: boolean } = {}) {
  const [state, setState] = useState<AsyncState<T>>({ data: null, error: null, loading: options.immediate !== false });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fn();
      setState({ data, error: null, loading: false });
      return data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState(prev => ({ ...prev, error: err, loading: false }));
      throw err;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (options.immediate === false) return;
    void execute();
  }, [execute, options.immediate]);

  return useMemo(() => ({ ...state, execute, setState }), [state, execute]);
}
