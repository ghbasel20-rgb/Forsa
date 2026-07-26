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

const translateChunk = async (chunk, langpair) => {
  const url = `${MYMEMORY_ENDPOINT}?q=${encodeURIComponent(chunk)}&langpair=${langpair}`;
  const response = await fetch(url);
  const body = await response.json();
  const translated = body?.responseData?.translatedText;

  if (!translated) {
    throw new Error('MyMemory returned no translation');
  }

  return translated;
};

export const translateText = async (text, targetLang = 'ar') => {
  if (!text) {
    return text;
  }

  try {
    const langpair = `en|${targetLang}`;
    const chunks = splitIntoChunks(text);
    const translatedChunks = [];

    for (const chunk of chunks) {
      translatedChunks.push(await translateChunk(chunk, langpair));
    }

    return translatedChunks.join(' ');
  } catch (error) {
    console.error('Translate text error:', error);
    return text;
  }
};
