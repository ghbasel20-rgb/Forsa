// Seeds the Appwrite "events" collection with fake events themed around
// Palestinian cultural workshops, civic/political education, leadership
// development, community events, field trips, and employment opportunities.
// Field names match what Events.jsx / EventDetail.jsx read: title, details,
// location, ageRange, cost, content.
//
// Usage: APPWRITE_API_KEY=xxxxx node scripts/seed-events.js

const ENDPOINT = 'https://cloud.appwrite.io/v1';
const PROJECT_ID = '699194ee000ccfb4ae0b';
const DATABASE_ID = '69b6e464000e1c479de5';
const EVENTS_COLLECTION_ID = 'events';

const apiKey = process.env.APPWRITE_API_KEY;
if (!apiKey) {
  console.error('Missing APPWRITE_API_KEY environment variable.');
  process.exit(1);
}

const events = [
  {
    title: 'Tatreez Embroidery Workshop: Preserving Palestinian Heritage',
    details: 'Learn the traditional art of Palestinian cross-stitch embroidery (tatreez) from a local artisan.',
    location: 'Ramallah Community Center',
    ageRange: '14+',
    cost: 'Free',
    content: 'This hands-on workshop introduces participants to tatreez, the centuries-old Palestinian embroidery tradition. Bring your own fabric or use materials provided. All skill levels welcome.',
  },
  {
    title: 'Dabke Dance Workshop',
    details: 'A lively introduction to dabke, the traditional Palestinian folk dance.',
    location: 'Bethlehem Cultural Hall',
    ageRange: 'All ages',
    cost: 'Free',
    content: 'Join local dance instructors for an energetic session learning the steps and history of dabke. No experience necessary, just bring comfortable shoes.',
  },
  {
    title: 'Palestinian Folklore & Storytelling Night',
    details: 'An evening of traditional stories, poetry, and oral history passed down through generations.',
    location: 'Nablus Old City Cultural Center',
    ageRange: 'All ages',
    cost: 'Free',
    content: 'Local elders and storytellers share folk tales, proverbs, and personal histories - a great opportunity for younger generations to connect with their heritage.',
  },
  {
    title: 'Palestinian Cuisine Cooking Class',
    details: 'Learn to prepare classic dishes like maqluba and musakhan from a home cook.',
    location: 'Hebron Community Kitchen',
    ageRange: '16+',
    cost: '20 NIS (materials included)',
    content: 'A hands-on cooking class covering traditional Palestinian recipes, techniques, and the cultural stories behind each dish.',
  },
  {
    title: 'Arabic Calligraphy & Illumination Workshop',
    details: 'Explore the art of Arabic calligraphy with a professional calligrapher.',
    location: 'Jerusalem Arts Center',
    ageRange: '12+',
    cost: 'Free',
    content: 'Participants will practice classical script styles and create a small illuminated piece to take home. All materials provided.',
  },
  {
    title: 'Civic Engagement 101: Know Your Community',
    details: 'An introductory session on local governance, civic institutions, and how community members can get involved.',
    location: 'Ramallah Youth Center',
    ageRange: '16-25',
    cost: 'Free',
    content: 'This workshop covers the basics of civic participation, including how local decisions are made and where young people can plug in to make their voices heard.',
  },
  {
    title: 'Advocacy & Public Speaking Training',
    details: 'Build the skills to speak confidently and advocate effectively for causes you care about.',
    location: 'Bethlehem University Auditorium',
    ageRange: '16-25',
    cost: 'Free (registration required)',
    content: 'A practical training covering public speaking fundamentals, structuring an argument, and presenting to community groups or officials.',
  },
  {
    title: 'Understanding Human Rights: An Introductory Seminar',
    details: 'A nonpartisan overview of human rights frameworks and how they apply locally and internationally.',
    location: 'Ramallah Community Center',
    ageRange: '16+',
    cost: 'Free',
    content: 'Led by a human rights educator, this seminar introduces core human rights concepts and encourages open, respectful discussion among participants.',
  },
  {
    title: 'Youth Leadership Retreat',
    details: 'A weekend retreat focused on developing leadership, teamwork, and community-organizing skills.',
    location: 'Jericho Retreat Center',
    ageRange: '15-22',
    cost: 'Free (limited spots)',
    content: 'Through workshops, team challenges, and mentorship sessions, participants will build practical leadership skills to bring back to their own communities.',
  },
  {
    title: 'Community Organizing Fundamentals',
    details: 'Learn the basics of organizing community initiatives, from planning to execution.',
    location: 'Nablus Community Hall',
    ageRange: '18+',
    cost: 'Free',
    content: 'This workshop walks through real examples of successful grassroots initiatives and gives participants tools to plan their own community projects.',
  },
  {
    title: 'Neighborhood Town Hall: Community Voices',
    details: 'An open forum for residents to share concerns and ideas with local community leaders.',
    location: 'Hebron Municipal Hall',
    ageRange: 'All ages',
    cost: 'Free',
    content: 'A moderated town hall meeting where community members can raise questions and discuss local priorities with community representatives.',
  },
  {
    title: 'Community Clean-Up Day',
    details: 'Join neighbors for a morning of cleaning up a local park and public spaces.',
    location: 'Ramallah City Park',
    ageRange: 'All ages',
    cost: 'Free',
    content: 'Gloves, bags, and tools provided. A great way to give back to the community and meet neighbors while making a visible difference.',
  },
  {
    title: 'Cultural Heritage Festival',
    details: 'A day-long celebration of Palestinian culture with food, music, dance, and crafts.',
    location: 'Bethlehem Manger Square',
    ageRange: 'All ages',
    cost: 'Free',
    content: "Local vendors, artists, and performers come together to celebrate Palestinian heritage through food stalls, live dabke performances, and craft workshops for all ages.",
  },
  {
    title: 'Community Iftar Gathering',
    details: 'A shared community meal open to all, celebrating togetherness and hospitality.',
    location: 'Nablus Community Center',
    ageRange: 'All ages',
    cost: 'Free',
    content: 'Neighbors and families are welcome to join a shared meal, with volunteers coordinating food and setup. Volunteers needed both before and during the event.',
  },
  {
    title: 'Field Trip: Old City Heritage Walk',
    details: 'A guided walking tour through the historic Old City, exploring its architecture and history.',
    location: 'Jerusalem Old City',
    ageRange: '12+',
    cost: 'Free (registration required)',
    content: "A local historian will guide participants through key historical and cultural landmarks, sharing stories about the area's architecture and heritage.",
  },
  {
    title: 'Field Trip: Palestinian Museum Visit',
    details: 'A group visit to the Palestinian Museum to explore rotating exhibits on history and culture.',
    location: 'Birzeit',
    ageRange: 'All ages',
    cost: 'Group entry covered',
    content: 'Transportation and a guided tour are included. Participants will explore current exhibits and take part in a short reflection discussion afterward.',
  },
  {
    title: 'Field Trip: Local University Campus Tour',
    details: 'Explore a university campus, meet current students, and learn about admissions and programs.',
    location: 'Birzeit University',
    ageRange: '15-18',
    cost: 'Free',
    content: 'Ideal for high school students exploring higher education options. Includes a campus tour, Q&A with current students, and an admissions info session.',
  },
  {
    title: 'Job Fair & Employment Networking Event',
    details: 'Meet local employers, submit applications, and network for internship and job opportunities.',
    location: 'Ramallah Convention Center',
    ageRange: '18+',
    cost: 'Free',
    content: 'Dozens of local employers and organizations will be on-site to discuss open roles, internships, and career paths. Bring copies of your resume.',
  },
  {
    title: 'Resume Writing & Interview Skills Workshop',
    details: 'A practical workshop to help you build a strong resume and prepare for job interviews.',
    location: 'Ramallah Youth Center',
    ageRange: '16-25',
    cost: 'Free',
    content: 'Career coaches will provide one-on-one feedback on resumes and run mock interview sessions to help participants feel confident in their next job search.',
  },
  {
    title: 'Career Mentorship Mixer',
    details: 'An informal networking event connecting students with professionals across various industries.',
    location: 'Bethlehem Chamber of Commerce',
    ageRange: '18-25',
    cost: 'Free',
    content: 'A relaxed mixer where students can meet and chat with working professionals in fields like tech, healthcare, education, and business for career advice and mentorship connections.',
  },
];

async function createDocument(event) {
  const res = await fetch(
    `${ENDPOINT}/databases/${DATABASE_ID}/collections/${EVENTS_COLLECTION_ID}/documents`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': PROJECT_ID,
        'X-Appwrite-Key': apiKey,
      },
      body: JSON.stringify({
        documentId: 'unique()',
        data: event,
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

  for (const event of events) {
    try {
      const doc = await createDocument(event);
      console.log(`Created: ${doc.$id} - ${event.title}`);
      created += 1;
    } catch (error) {
      console.error(`Failed: ${event.title} - ${error.message}`);
      failed += 1;
    }
  }

  console.log(`\nDone. Created ${created}, failed ${failed}.`);
}

seed();
