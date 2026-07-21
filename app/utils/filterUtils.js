export const MATCH_THRESHOLD_OPTIONS = [
  { label: 'Any Match', value: 0 },
  { label: '50%+ Match', value: 50 },
  { label: '80%+ Match', value: 80 },
];

export const SORT_OPTIONS = [
  { label: 'Match %', value: 'match' },
  { label: 'Most Recent', value: 'recent' },
  { label: 'A-Z', value: 'alpha' },
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
    case 'match':
    default:
      return sorted.sort((a, b) => (b.matchPercentage ?? 0) - (a.matchPercentage ?? 0));
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
