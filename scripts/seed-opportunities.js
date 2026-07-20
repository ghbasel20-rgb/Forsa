// One-off seed script: populates the Appwrite "opportunities" collection with
// fake opportunities that overlap the real skills/interests option lists
// (see Buildprofileskills.jsx / Buildprofileinterests.jsx) so profile matching
// in TopMatches has something to match against.
//
// Usage: APPWRITE_API_KEY=xxxxx node scripts/seed-opportunities.js

const ENDPOINT = 'https://cloud.appwrite.io/v1';
const PROJECT_ID = '699194ee000ccfb4ae0b';
const DATABASE_ID = '69b6e464000e1c479de5';
const OPPORTUNITIES_COLLECTION_ID = 'opportunities';

const apiKey = process.env.APPWRITE_API_KEY;
if (!apiKey) {
  console.error('Missing APPWRITE_API_KEY environment variable.');
  process.exit(1);
}

const opportunities = [
  {
    title: 'Junior Frontend Developer Internship',
    location: 'Tel Aviv',
    category: 'Internship',
    description: 'Work alongside our product team building customer-facing features in React. Great first step for students exploring web development.',
    requirements: ['Basic JavaScript knowledge', 'Familiarity with HTML/CSS', 'Currently enrolled in a degree program'],
    url: 'https://example.com/careers/frontend-intern',
    skills: ['Programming', 'Web Development', 'Problem Solving'],
    interests: ['Technology'],
  },
  {
    title: 'UI/UX Design Mentorship Program',
    location: 'Remote',
    category: 'Mentorship',
    description: 'A 10-week mentorship pairing you with a senior product designer to build a portfolio-ready case study.',
    requirements: ['Portfolio or design samples', 'Figma experience preferred'],
    url: 'https://example.com/careers/ux-mentorship',
    skills: ['UI/UX Design', 'Design', 'Creativity'],
    interests: ['Arts', 'Technology'],
  },
  {
    title: 'Community Sports Coach Volunteer',
    location: 'Haifa',
    category: 'Volunteering',
    description: 'Coach youth teams twice a week at our community center. No coaching certification required, just enthusiasm.',
    requirements: ['Reliable availability on weekday evenings'],
    url: 'https://example.com/volunteer/sports-coach',
    skills: ['Leadership', 'Teamwork', 'Communication'],
    interests: ['Sports', 'Volunteering'],
  },
  {
    title: 'Marketing & Social Media Intern',
    location: 'Jerusalem',
    category: 'Internship',
    description: 'Help plan and run campaigns across Instagram and TikTok for a fast-growing nonprofit.',
    requirements: ['Active social media user', 'Basic content creation skills'],
    url: 'https://example.com/careers/marketing-intern',
    skills: ['Marketing', 'Digital Marketing', 'Social Media', 'Content Creation'],
    interests: ['Business', 'Technology'],
  },
  {
    title: 'Data Analysis Research Assistant',
    location: 'Remote',
    category: 'Research',
    description: 'Support a university research team cleaning and analyzing survey data using spreadsheets and basic statistics.',
    requirements: ['Comfortable with Excel or Google Sheets', 'Attention to detail'],
    url: 'https://example.com/research/data-assistant',
    skills: ['Data Analysis', 'Research', 'Critical Thinking'],
    interests: ['Science', 'Education'],
  },
  {
    title: 'Startup Pitch Bootcamp',
    location: 'Tel Aviv',
    category: 'Workshop',
    description: 'A weekend bootcamp teaching first-time founders how to build and pitch an MVP to investors.',
    requirements: ['An idea or interest in entrepreneurship'],
    url: 'https://example.com/events/pitch-bootcamp',
    skills: ['Public Speaking', 'Project Management', 'Leadership'],
    interests: ['Entrepreneurship', 'Business', 'Finance'],
  },
  {
    title: 'Photography Volunteer for Local Events',
    location: 'Haifa',
    category: 'Volunteering',
    description: 'Document community events and workshops for our nonprofit’s marketing materials.',
    requirements: ['Own camera or capable smartphone', 'Portfolio of past shots'],
    url: 'https://example.com/volunteer/photography',
    skills: ['Photography', 'Creativity'],
    interests: ['Photography', 'Arts', 'Volunteering'],
  },
  {
    title: 'Customer Support Trainee',
    location: 'Remote',
    category: 'Internship',
    description: 'Learn the fundamentals of customer success by handling real support tickets under mentor supervision.',
    requirements: ['Strong written English', 'Patience and empathy'],
    url: 'https://example.com/careers/support-trainee',
    skills: ['Customer Service', 'Communication', 'Problem Solving'],
    interests: ['Business'],
  },
  {
    title: 'Environmental Cleanup Volunteer Day',
    location: 'Eilat',
    category: 'Volunteering',
    description: 'Join a beach and coral reef cleanup initiative in partnership with local environmental groups.',
    requirements: ['Able to attend a full-day outdoor event'],
    url: 'https://example.com/volunteer/beach-cleanup',
    skills: ['Teamwork'],
    interests: ['Environment', 'Nature', 'Outdoor Activities', 'Volunteering'],
  },
  {
    title: 'Mobile App Development Workshop Series',
    location: 'Remote',
    category: 'Workshop',
    description: 'A 6-session series teaching React Native fundamentals by building a small app from scratch.',
    requirements: ['Basic programming background helpful but not required'],
    url: 'https://example.com/events/mobile-dev-workshop',
    skills: ['Programming', 'Mobile Development', 'Web Development'],
    interests: ['Technology'],
  },
  {
    title: 'Content Writing Internship',
    location: 'Jerusalem',
    category: 'Internship',
    description: 'Write blog posts, newsletters, and social copy for an early-stage edtech startup.',
    requirements: ['Strong writing samples', 'Comfortable with tight deadlines'],
    url: 'https://example.com/careers/content-writer',
    skills: ['Writing', 'Content Creation', 'Communication'],
    interests: ['Education', 'Reading'],
  },
  {
    title: 'Cooking Class Assistant Volunteer',
    location: 'Tel Aviv',
    category: 'Volunteering',
    description: 'Assist a chef running free weekly cooking classes for underserved youth in the community.',
    requirements: ['Basic kitchen safety knowledge', 'Weekly availability'],
    url: 'https://example.com/volunteer/cooking-class',
    skills: ['Teaching', 'Teamwork'],
    interests: ['Cooking', 'Food & Dining', 'Volunteering'],
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
