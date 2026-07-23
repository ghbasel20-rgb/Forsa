// Second seed pass: adds opportunities covering every skill/interest tag that
// wasn't used in the first batch (see seed-opportunities.js), plus one broad
// multi-track opportunity tagged with the FULL skill + interest lists so that
// any profile satisfying the app's minimum selection rules (>=1 skill,
// >=3 interests) always scores at least one Top Match — see
// getMatchedOpportunities in services/opportunities-service.js: score needed
// is max(2, ceil(selectionCount / 2)), and a fully-tagged opportunity always
// overlaps with every tag the user picked, so overlap === selectionCount,
// which is always >= that threshold.
//
// Usage: APPWRITE_API_KEY=xxxxx node scripts/seed-more-opportunities.js

const ENDPOINT = 'https://cloud.appwrite.io/v1';
const PROJECT_ID = '699194ee000ccfb4ae0b';
const DATABASE_ID = '69b6e464000e1c479de5';
const OPPORTUNITIES_COLLECTION_ID = 'opportunities';

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

const opportunities = [
  {
    title: 'Video Content Creator Internship',
    location: 'Tel Aviv',
    category: 'Internship',
    description: 'Shoot and edit short-form video content for a media startup\'s social channels.',
    requirements: ['Portfolio of edited video work', 'Familiarity with editing software'],
    url: 'https://example.com/careers/video-creator-intern',
    skills: ['Video Editing', 'Content Creation', 'Creativity'],
    interests: ['Movies & TV', 'Technology'],
  },
  {
    title: 'Freelance Translator Program',
    location: 'Remote',
    category: 'Freelance',
    description: 'Translate community resources and outreach materials into multiple languages for international volunteers.',
    requirements: ['Fluency in at least two languages', 'Strong attention to detail'],
    url: 'https://example.com/careers/translator-program',
    skills: ['Translation', 'Communication', 'Writing'],
    interests: ['Languages', 'Travel'],
  },
  {
    title: 'Retail Sales Associate (Part-Time)',
    location: 'Jerusalem',
    category: 'Part-Time Job',
    description: 'Assist customers on the floor of a growing local fashion boutique, part-time hours around school.',
    requirements: ['Friendly, outgoing personality', 'Weekend availability'],
    url: 'https://example.com/careers/retail-sales-associate',
    skills: ['Sales', 'Customer Service', 'Communication'],
    interests: ['Fashion', 'Business'],
  },
  {
    title: 'Nonprofit Bookkeeping Volunteer',
    location: 'Remote',
    category: 'Volunteering',
    description: 'Help a small nonprofit keep its books organized ahead of its annual audit.',
    requirements: ['Basic bookkeeping or accounting knowledge', 'Comfortable with spreadsheets'],
    url: 'https://example.com/volunteer/bookkeeping',
    skills: ['Accounting', 'Time Management', 'Critical Thinking'],
    interests: ['Finance', 'Business'],
  },
  {
    title: 'Brand Identity Graphic Design Gig',
    location: 'Remote',
    category: 'Freelance',
    description: 'Design a logo and brand guide for an early-stage fashion label.',
    requirements: ['Portfolio of brand/logo work', 'Proficiency with design tools'],
    url: 'https://example.com/careers/brand-graphic-design',
    skills: ['Graphic Design', 'Creativity', 'Design'],
    interests: ['Arts', 'Fashion'],
  },
  {
    title: 'SEO & Growth Marketing Internship',
    location: 'Tel Aviv',
    category: 'Internship',
    description: 'Optimize site content and track growth metrics for an early-stage tech company.',
    requirements: ['Interest in analytics', 'Comfortable learning new tools quickly'],
    url: 'https://example.com/careers/seo-growth-intern',
    skills: ['SEO', 'Digital Marketing', 'Data Analysis'],
    interests: ['Technology', 'Business'],
  },
  {
    title: 'Community Radio Host Volunteer',
    location: 'Haifa',
    category: 'Volunteering',
    description: 'Host a weekly community radio segment featuring local music and arts news.',
    requirements: ['Comfortable speaking on air', 'Reliable weekly time slot'],
    url: 'https://example.com/volunteer/radio-host',
    skills: ['Public Speaking', 'Time Management'],
    interests: ['Music', 'Theater'],
  },
  {
    title: 'Youth Dance Program Instructor',
    location: 'Tel Aviv',
    category: 'Volunteering',
    description: 'Lead weekly dance classes for kids at a community youth center.',
    requirements: ['Dance background', 'Experience working with children a plus'],
    url: 'https://example.com/volunteer/youth-dance-instructor',
    skills: ['Teaching', 'Time Management', 'Leadership'],
    interests: ['Dancing', 'Health & Fitness'],
  },
  {
    title: 'Personal Fitness Coach Volunteer',
    location: 'Eilat',
    category: 'Volunteering',
    description: 'Run free weekend fitness sessions for community members of all ages.',
    requirements: ['Fitness training background or certification'],
    url: 'https://example.com/volunteer/fitness-coach',
    skills: ['Leadership', 'Communication'],
    interests: ['Health & Fitness', 'Sports'],
  },
  {
    title: 'Real Estate Marketing Intern',
    location: 'Jerusalem',
    category: 'Internship',
    description: 'Support a real estate agency with listing marketing, outreach, and client communication.',
    requirements: ['Strong communication skills', 'Interest in property markets'],
    url: 'https://example.com/careers/real-estate-marketing-intern',
    skills: ['Marketing', 'Sales', 'Communication'],
    interests: ['Real Estate', 'Business'],
  },
  {
    title: 'History Museum Docent Volunteer',
    location: 'Jerusalem',
    category: 'Volunteering',
    description: 'Lead guided tours and research exhibit content at a local history museum.',
    requirements: ['Strong public speaking skills', 'Interest in historical research'],
    url: 'https://example.com/volunteer/museum-docent',
    skills: ['Public Speaking', 'Teaching', 'Research'],
    interests: ['History', 'Education'],
  },
  {
    title: 'Philosophy & Psychology Discussion Club Facilitator',
    location: 'Remote',
    category: 'Volunteering',
    description: 'Facilitate weekly online discussion sessions exploring philosophy and psychology topics with fellow students.',
    requirements: ['Strong discussion facilitation skills', 'Genuine interest in the topics'],
    url: 'https://example.com/volunteer/discussion-club-facilitator',
    skills: ['Public Speaking', 'Critical Thinking', 'Communication'],
    interests: ['Philosophy', 'Psychology'],
  },
  {
    title: 'Local Campaign Outreach Volunteer',
    location: 'Tel Aviv',
    category: 'Volunteering',
    description: 'Help a local civic campaign with door-to-door outreach and community events.',
    requirements: ['Comfortable engaging with the public', 'Reliable weekend availability'],
    url: 'https://example.com/volunteer/campaign-outreach',
    skills: ['Communication', 'Marketing'],
    interests: ['Politics', 'Volunteering'],
  },
  {
    title: 'Travel Blogger Content Program',
    location: 'Remote',
    category: 'Freelance',
    description: 'Write and photograph travel stories for a growing travel media outlet.',
    requirements: ['Writing samples', 'Willingness to travel occasionally'],
    url: 'https://example.com/careers/travel-blogger-program',
    skills: ['Writing', 'Photography', 'Content Creation'],
    interests: ['Travel', 'Writing'],
  },
  {
    title: 'Game Design Club Mentor',
    location: 'Remote',
    category: 'Mentorship',
    description: 'Mentor a high school game design club building their first indie game prototype.',
    requirements: ['Programming or game design experience'],
    url: 'https://example.com/volunteer/game-design-mentor',
    skills: ['Programming', 'Creativity', 'Problem Solving'],
    interests: ['Gaming', 'Technology'],
  },
  {
    title: 'Theater Production Crew Volunteer',
    location: 'Haifa',
    category: 'Volunteering',
    description: 'Join the backstage crew for a community theater\'s upcoming production season.',
    requirements: ['Available for evening rehearsals', 'Team-oriented mindset'],
    url: 'https://example.com/volunteer/theater-crew',
    skills: ['Time Management', 'Creativity', 'Teamwork'],
    interests: ['Theater', 'Arts'],
  },
  {
    title: 'Community Kitchen Volunteer Chef Assistant',
    location: 'Tel Aviv',
    category: 'Volunteering',
    description: 'Assist head chefs preparing meals for a community kitchen serving families in need.',
    requirements: ['Basic kitchen skills', 'Weekly availability'],
    url: 'https://example.com/volunteer/community-kitchen',
    skills: ['Cooking', 'Teamwork', 'Time Management'],
    interests: ['Food & Dining', 'Health & Fitness'],
  },
  {
    title: 'Forsa General Fellowship & Multi-Track Program',
    location: 'Remote',
    category: 'Fellowship',
    description: 'An open, multi-track fellowship spanning technology, business, arts, sciences, and community impact. We welcome students from every discipline and background for a flexible, self-paced program with mentorship, project work, and networking tailored to your interests.',
    requirements: ['Currently a student or recent graduate', 'A few hours per week of availability', 'Open to any background or skillset'],
    url: 'https://example.com/careers/general-fellowship',
    skills: ALL_SKILLS,
    interests: ALL_INTERESTS,
  },
];

async function createDocument(opportunity) {
  const res = await fetch(
    `${ENDPOINT}/databases/${DATABASE_ID}/collections/${OPPORTUNITIES_COLLECTION_ID}/documents`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': PROJECT_ID,
        'X-Appwrite-Key': apiKey,
      },
      body: JSON.stringify({
        documentId: 'unique()',
        data: opportunity,
        permissions: ['read("any")'],
      }),
    }
  );

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.message || `HTTP ${res.status}`);
  }
  return body;
}

async function seed() {
  let created = 0;
  let failed = 0;

  for (const opportunity of opportunities) {
    try {
      const doc = await createDocument(opportunity);
      console.log(`Created: ${doc.$id} - ${opportunity.title}`);
      created += 1;
    } catch (error) {
      console.error(`Failed: ${opportunity.title} - ${error.message}`);
      failed += 1;
    }
  }

  console.log(`\nDone. Created ${created}, failed ${failed}.`);
}

seed();
