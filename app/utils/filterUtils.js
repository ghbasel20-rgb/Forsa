export const getMatchThresholdOptions = (t) => [
  { label: t('filterOptions.anyMatch'), value: 0 },
  { label: t('filterOptions.match50'), value: 50 },
  { label: t('filterOptions.match80'), value: 80 },
];

export const getSortOptions = (t) => [
  { label: t('filterOptions.sortMatch'), value: 'match' },
  { label: t('filterOptions.sortRecent'), value: 'recent' },
  { label: t('filterOptions.sortAlpha'), value: 'alpha' },
];

export const getEventSortOptions = (t) => [
  ...getSortOptions(t),
  { label: t('filterOptions.sortDueDate'), value: 'dueDate' },
];

export const AGE_BUCKETS = [
  { label: '13-17', min: 13, max: 17 },
  { label: '18-24', min: 18, max: 24 },
  { label: '25+', min: 25, max: Infinity },
];

export const getDistinctValues = (items, field) => {
  const values = new Set();
  items.forEach((item) => {
    (item[field] || []).forEach((value) => values.add(value));
  });
  return Array.from(values).sort();
};

export const sortItems = (items, sortBy) => {
  const sorted = [...items];
  switch (sortBy) {
    case 'recent':
      return sorted.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
    case 'alpha':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'dueDate':
      return sorted.sort((a, b) => {
        if (!!a.isClosed !== !!b.isClosed) return a.isClosed ? 1 : -1;
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    case 'match':
    default:
      return sorted.sort((a, b) => {
        if (!!a.isClosed !== !!b.isClosed) return a.isClosed ? 1 : -1;
        return (b.matchPercentage ?? 0) - (a.matchPercentage ?? 0);
      });
  }
};

// Best-effort parse of a free-text ageRange string (e.g. "14+", "16-25", "All ages")
// into a { min, max } range, since events don't store structured min/max age fields.
export const parseAgeRange = (ageRangeText) => {
  if (!ageRangeText) return { min: 0, max: Infinity };

  const text = ageRangeText.toLowerCase();
  if (text.includes('all')) return { min: 0, max: Infinity };

  const numbers = (text.match(/\d+/g) || []).map(Number);
  if (numbers.length === 0) return { min: 0, max: Infinity };
  if (numbers.length === 1) {
    return text.includes('+')
      ? { min: numbers[0], max: Infinity }
      : { min: numbers[0], max: numbers[0] };
  }
  return { min: numbers[0], max: numbers[1] };
};

export const eventMatchesAgeBuckets = (event, selectedBuckets) => {
  if (selectedBuckets.length === 0) return true;

  const { min, max } = parseAgeRange(event.ageRange);
  return selectedBuckets.some((label) => {
    const bucket = AGE_BUCKETS.find((b) => b.label === label);
    return bucket && min <= bucket.max && max >= bucket.min;
  });
};
