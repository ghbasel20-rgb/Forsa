// One-off migration: adds `skills` and `interests` array attributes to the
// Appwrite "events" collection (mirroring the "opportunities" collection),
// then backfills the events seeded by seed-events.js with tags drawn from
// the same skill/interest option lists used in Buildprofileskills.jsx /
// Buildprofileinterests.jsx, so profile matching in EventTopMatches has
// something to match against (see getMatchedEvents in
// services/events-service.js).
//
// "مهرجان التراث الثقافي" (Cultural Heritage Festival) is tagged with every
// skill/interest, the same trick seed-more-opportunities.js uses, so a Top
// Match always exists regardless of the user's profile.
//
// Usage: APPWRITE_API_KEY=xxxxx node scripts/add-event-skills-interests.js

const ENDPOINT = 'https://cloud.appwrite.io/v1';
const PROJECT_ID = '699194ee000ccfb4ae0b';
const DATABASE_ID = '69b6e464000e1c479de5';
const EVENTS_COLLECTION_ID = 'events';

const apiKey = process.env.APPWRITE_API_KEY;
if (!apiKey) {
  console.error('Missing APPWRITE_API_KEY environment variable.');
  process.exit(1);
}

const ALL_SKILLS = [
  'Programming', 'Design', 'Writing', 'Public Speaking', 'Research', 'Marketing',
  'Data Analysis', 'Project Management', 'Leadership', 'Communication', 'Problem Solving',
  'Creativity', 'Teamwork', 'Time Management', 'Critical Thinking', 'Digital Marketing',
  'Video Editing', 'Photography', 'Translation', 'Teaching', 'Sales', 'Customer Service',
  'Accounting', 'Web Development', 'Mobile Development', 'UI/UX Design', 'Graphic Design',
  'Content Creation', 'Social Media', 'SEO', 'Cooking',
];

const ALL_INTERESTS = [
  'Technology', 'Arts', 'Sports', 'Business', 'Science', 'Music', 'Travel', 'Gaming',
  'Reading', 'Cooking', 'Fashion', 'Health & Fitness', 'Photography', 'Movies & TV',
  'Nature', 'Politics', 'History', 'Philosophy', 'Psychology', 'Education', 'Environment',
  'Volunteering', 'Entrepreneurship', 'Finance', 'Real Estate', 'Food & Dining',
  'Outdoor Activities', 'Writing', 'Dancing', 'Theater', 'Languages',
];

// Keyed by the exact `title` used in seed-events.js.
const eventTags = {
  'ورشة تطريز فلسطيني: الحفاظ على التراث': {
    skills: ['Creativity'],
    interests: ['Arts', 'History'],
  },
  'ورشة رقص الدبكة': {
    skills: ['Teamwork'],
    interests: ['Dancing', 'Arts'],
  },
  'أمسية الفولكلور والحكايات الفلسطينية': {
    skills: ['Communication'],
    interests: ['History', 'Reading'],
  },
  'صف طبخ المأكولات الفلسطينية': {
    skills: ['Cooking'],
    interests: ['Cooking', 'Food & Dining'],
  },
  'ورشة الخط العربي والزخرفة': {
    skills: ['Creativity', 'Design'],
    interests: ['Arts'],
  },
  'مقدمة في المشاركة المدنية: تعرّف على مجتمعك': {
    skills: ['Critical Thinking', 'Communication'],
    interests: ['Politics', 'Education'],
  },
  'تدريب على المناصرة وفن الخطابة': {
    skills: ['Public Speaking', 'Communication'],
    interests: ['Politics'],
  },
  'فهم حقوق الإنسان: ندوة تمهيدية': {
    skills: ['Critical Thinking', 'Research'],
    interests: ['Politics', 'Philosophy'],
  },
  'معسكر القيادة الشبابية': {
    skills: ['Leadership', 'Teamwork', 'Time Management'],
    interests: ['Education'],
  },
  'أساسيات التنظيم المجتمعي': {
    skills: ['Leadership', 'Project Management'],
    interests: ['Volunteering', 'Politics'],
  },
  'لقاء مفتوح للحي: أصوات المجتمع': {
    skills: ['Communication', 'Public Speaking'],
    interests: ['Politics'],
  },
  'يوم تنظيف المجتمع': {
    skills: ['Teamwork'],
    interests: ['Environment', 'Volunteering', 'Outdoor Activities'],
  },
  'مهرجان التراث الثقافي': {
    skills: ALL_SKILLS,
    interests: ALL_INTERESTS,
  },
  'إفطار جماعي مجتمعي': {
    skills: ['Teamwork'],
    interests: ['Volunteering', 'Food & Dining'],
  },
  'رحلة ميدانية: جولة تراثية في البلدة القديمة': {
    skills: ['Research'],
    interests: ['History', 'Outdoor Activities'],
  },
  'رحلة ميدانية: زيارة المتحف الفلسطيني': {
    skills: ['Research'],
    interests: ['History', 'Education'],
  },
  'رحلة ميدانية: جولة في حرم جامعي محلي': {
    skills: ['Time Management'],
    interests: ['Education'],
  },
  'معرض توظيف وفعالية للتواصل المهني': {
    skills: ['Communication', 'Sales'],
    interests: ['Business', 'Entrepreneurship'],
  },
  'ورشة كتابة السيرة الذاتية ومهارات المقابلات': {
    skills: ['Writing', 'Communication', 'Public Speaking'],
    interests: ['Business', 'Education'],
  },
  'لقاء إرشاد مهني': {
    skills: ['Communication', 'Leadership'],
    interests: ['Business', 'Entrepreneurship'],
  },
};

const headers = {
  'Content-Type': 'application/json',
  'X-Appwrite-Project': PROJECT_ID,
  'X-Appwrite-Key': apiKey,
};

async function createArrayAttribute(key) {
  const res = await fetch(
    `${ENDPOINT}/databases/${DATABASE_ID}/collections/${EVENTS_COLLECTION_ID}/attributes/string`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({ key, size: 255, required: false, array: true }),
    }
  );

  if (res.status === 409) {
    console.log(`Attribute "${key}" already exists, skipping creation.`);
    return;
  }

  const body = await res.json();
  if (!res.ok) {
    throw new Error(`Create attribute "${key}" failed: ${body.message || res.status}`);
  }
  console.log(`Created attribute "${key}".`);
}

async function waitForAttribute(key) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const res = await fetch(
      `${ENDPOINT}/databases/${DATABASE_ID}/collections/${EVENTS_COLLECTION_ID}/attributes/${key}`,
      { headers }
    );
    const body = await res.json();
    if (res.ok && body.status === 'available') {
      console.log(`Attribute "${key}" is available.`);
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error(`Attribute "${key}" did not become available in time.`);
}

async function listAllEvents() {
  const limitQuery = JSON.stringify({ method: 'limit', values: [100] });
  const res = await fetch(
    `${ENDPOINT}/databases/${DATABASE_ID}/collections/${EVENTS_COLLECTION_ID}/documents?queries[]=${encodeURIComponent(limitQuery)}`,
    { headers }
  );
  const body = await res.json();
  if (!res.ok) {
    throw new Error(`List events failed: ${body.message || res.status}`);
  }
  return body.documents;
}

async function updateEventTags(documentId, tags) {
  const res = await fetch(
    `${ENDPOINT}/databases/${DATABASE_ID}/collections/${EVENTS_COLLECTION_ID}/documents/${documentId}`,
    {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ data: tags }),
    }
  );
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.message || `HTTP ${res.status}`);
  }
  return body;
}

async function run() {
  await createArrayAttribute('skills');
  await createArrayAttribute('interests');
  await waitForAttribute('skills');
  await waitForAttribute('interests');

  const events = await listAllEvents();

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const event of events) {
    const tags = eventTags[event.title];
    if (!tags) {
      console.warn(`No tags defined for "${event.title}", skipping.`);
      skipped += 1;
      continue;
    }

    try {
      await updateEventTags(event.$id, tags);
      console.log(`Tagged: ${event.$id} - ${event.title}`);
      updated += 1;
    } catch (error) {
      console.error(`Failed to tag "${event.title}": ${error.message}`);
      failed += 1;
    }
  }

  console.log(`\nDone. Updated ${updated}, skipped ${skipped}, failed ${failed}.`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
