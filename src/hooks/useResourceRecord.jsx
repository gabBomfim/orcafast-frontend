import { useMemo } from 'react';
import { useResource } from './useResource';

export const useResourceRecord = ({
  values,
  resource,
  alias,
  field,
  autoFetch = false
}) => {
  const rsrc = useResource({
    resource,
    alias,
    autoFetch
  });

  return useMemo(
    () => rsrc.records.find((record) => record.id === +values[field]) || {},
    [rsrc.records, values]
  );
};
