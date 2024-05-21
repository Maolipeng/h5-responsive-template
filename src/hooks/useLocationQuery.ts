import type { ParsedQuery } from 'query-string';
import queryString from 'query-string';
import { useEffect, useState } from 'react';

function useLocationQuery<T = any>(): ParsedQuery<T> {
  const [query, setQuery] = useState<ParsedQuery<T>>({});

  useEffect(() => {
    const parsedQuery = queryString.parse(window.location.search);
    setQuery(parsedQuery as ParsedQuery<T>);
  }, []);

  return query;
}
export default useLocationQuery;
