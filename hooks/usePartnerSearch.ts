import { useMemo } from 'react';
import Fuse from 'fuse.js';
import { AD_SERVERS, FALLBACK_ERROR } from '../constants';

export const usePartnerSearch = (query: string): string[] => {
  // 1. Prepare Data: Extract names as strings
  const partnerNames = useMemo(() => {
    return Object.values(AD_SERVERS).map((server) => server.name);
  }, []);

  // 2. Initialize Fuse with strings
  const fuse = useMemo(() => {
    return new Fuse(partnerNames, {
      threshold: 0.3,
      isCaseSensitive: false,
    });
  }, [partnerNames]);

  // 3. Search Logic
  const results = useMemo(() => {
    // If input is empty/whitespace, return all options
    if (!query || !query.trim()) {
      return partnerNames;
    }

    const fuseResults = fuse.search(query);

    // Requirement: If no match is found, return the fallback string
    if (fuseResults.length === 0) {
      return [FALLBACK_ERROR];
    }

    // Requirement: Map results to strings immediately
    return fuseResults.map((result) => result.item);
  }, [query, fuse, partnerNames]);

  return results;
};