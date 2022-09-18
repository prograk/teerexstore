import { useCallback, useState } from 'react';

const useLoadingApi = (requestCallback) => {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const call = useCallback(
    (...args) => {
      setLoading(true);
      return requestCallback(...args).then(() => {
        setLoading(false);
        setLoaded(true);
      });
    },
    [requestCallback]
  );

  return { call, loading, loaded };
};

export default useLoadingApi;
