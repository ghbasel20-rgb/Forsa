import Fuse from 'fuse.js';

const FUSE_OPTIONS = {
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

export const getFuzzyMatchIds = (items, query, keys) => {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const fuse = new Fuse(items, { ...FUSE_OPTIONS, keys });
  return new Set(fuse.search(trimmed).map((result) => result.item.$id));
};
