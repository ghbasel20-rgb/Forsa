const MYMEMORY_ENDPOINT = 'https://api.mymemory.translated.net/get';
const MAX_CHUNK_LENGTH = 500;

const splitIntoChunks = (text) => {
  if (text.length <= MAX_CHUNK_LENGTH) {
    return [text];
  }

  const words = text.split(' ');
  const chunks = [];
  let currentChunk = '';

  for (const word of words) {
    const candidate = currentChunk ? `${currentChunk} ${word}` : word;
    if (candidate.length > MAX_CHUNK_LENGTH && currentChunk) {
      chunks.push(currentChunk);
      currentChunk = word;
    } else {
      currentChunk = candidate;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
};

// Catches responses that are just the untranslated/URL-encoded request
// echoed back (seen from misbehaving proxies and broken providers), which
// would otherwise get cached as if it were a real translation.
const looksLikeGarbage = (text) => /%\s{0,3}[0-9A-Fa-f]{2}/.test(text);

const translateChunkWithMyMemory = async (chunk, sourceLang, targetLang) => {
  const langpair = `${sourceLang}|${targetLang}`;
  const url = `${MYMEMORY_ENDPOINT}?q=${encodeURIComponent(chunk)}&langpair=${langpair}`;
  const response = await fetch(url);
  const body = await response.json();
  const translated = body?.responseData?.translatedText;

  if (!translated || /MYMEMORY WARNING/i.test(translated) || looksLikeGarbage(translated) || body?.responseStatus !== 200) {
    throw new Error(body?.responseDetails || 'MyMemory translation failed');
  }

  return translated;
};

const translateChunk = (chunk, sourceLang, targetLang) =>
  translateChunkWithMyMemory(chunk, sourceLang, targetLang);

// Returns null (never the original text) on failure, so callers can tell a
// real translation apart from a fallback and avoid caching the fallback.
export const translateText = async (text, targetLang = 'ar', sourceLang = 'en') => {
  if (!text || !text.trim()) {
    return null;
  }

  try {
    const chunks = splitIntoChunks(text);
    const translatedChunks = [];

    for (const chunk of chunks) {
      translatedChunks.push(await translateChunk(chunk, sourceLang, targetLang));
    }

    return translatedChunks.join(' ');
  } catch (error) {
    console.error('Translate text error:', error);
    return null;
  }
};

export const translateBatch = async (texts, targetLang = 'ar', sourceLang = 'en') => {
  const results = [];
  for (const text of texts) {
    results.push(await translateText(text, targetLang, sourceLang));
  }
  return results;
};

export const detectAndTranslate = (text, targetLang = 'ar') => translateText(text, targetLang, 'auto');
