import { useMemo } from 'react';
import Fuse from 'fuse.js';
import { AD_SERVERS } from '../constants';

export const useAdServerSearch = () => {
  // Transform dictionary to array for Fuse
  const adServerList = useMemo(() => {
    return Object.entries(AD_SERVERS).map(([key, def]) => ({
      key,
      name: def.name,
      ...def
    }));
  }, []);

  // Initialize Fuse instance
  const fuse = useMemo(() => {
    return new Fuse(adServerList, {
      keys: ['name'],
      threshold: 0.3,
      isCaseSensitive: false,
    });
  }, [adServerList]);

  const search = (query: string) => {
    if (!query) return adServerList;
    return fuse.search(query).map(result => result.item);
  };

  return { search };
};