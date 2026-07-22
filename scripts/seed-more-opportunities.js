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
// Content is in Arabic. skills/interests values are intentionally left in
// English since they must match the exact chip values used by the profile
// builder screens for match scoring. This only affects documents created by
// a fresh run of this script - it does not modify any English-language
// documents already seeded in the live database.
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
    title: 'تدريب منتج محتوى فيديو',
    location: 'تل أبيب',
    category: 'تدريب',
    description: 'صوّر وحرّر محتوى فيديو قصير لقنوات التواصل الاجتماعي لشركة إعلام ناشئة.',
    requirements: ['معرض أعمال فيديو تم تحريره', 'إلمام ببرامج التحرير'],
    url: 'https://example.com/careers/video-creator-intern',
    skills: ['Video Editing', 'Content Creation', 'Creativity'],
    interests: ['Movies & TV', 'Technology'],
  },
  {
    title: 'برنامج مترجم مستقل',
    location: 'عن بُعد',
    category: 'عمل حر',
    description: 'ترجم موارد مجتمعية ومواد توعوية إلى عدة لغات للمتطوعين الدوليين.',
    requirements: ['إتقان لغتين على الأقل', 'دقة عالية في التفاصيل'],
    url: 'https://example.com/careers/translator-program',
    skills: ['Translation', 'Communication', 'Writing'],
    interests: ['Languages', 'Travel'],
  },
  {
    title: 'موظف مبيعات تجزئة (دوام جزئي)',
    location: 'القدس',
    category: 'وظيفة بدوام جزئي',
    description: 'ساعد الزبائن في متجر أزياء محلي متنامٍ، بساعات عمل جزئية حول جدول الدراسة.',
    requirements: ['شخصية ودودة ومنفتحة', 'توفر في عطلة نهاية الأسبوع'],
    url: 'https://example.com/careers/retail-sales-associate',
    skills: ['Sales', 'Customer Service', 'Communication'],
    interests: ['Fashion', 'Business'],
  },
  {
    title: 'متطوع محاسبة لمؤسسة غير ربحية',
    location: 'عن بُعد',
    category: 'تطوع',
    description: 'ساعد مؤسسة غير ربحية صغيرة في تنظيم سجلاتها المالية قبل التدقيق السنوي.',
    requirements: ['معرفة أساسية بالمحاسبة أو مسك الدفاتر', 'إتقان جداول البيانات'],
    url: 'https://example.com/volunteer/bookkeeping',
    skills: ['Accounting', 'Time Management', 'Critical Thinking'],
    interests: ['Finance', 'Business'],
  },
  {
    title: 'مشروع تصميم هوية بصرية',
    location: 'عن بُعد',
    category: 'عمل حر',
    description: 'صمّم شعاراً ودليل هوية بصرية لعلامة أزياء ناشئة.',
    requirements: ['معرض أعمال في تصميم الهويات/الشعارات', 'إتقان أدوات التصميم'],
    url: 'https://example.com/careers/brand-graphic-design',
    skills: ['Graphic Design', 'Creativity', 'Design'],
    interests: ['Arts', 'Fashion'],
  },
  {
    title: 'تدريب في تحسين محركات البحث وتسويق النمو',
    location: 'تل أبيب',
    category: 'تدريب',
    description: 'حسّن محتوى الموقع وتتبّع مؤشرات النمو لشركة تقنية ناشئة.',
    requirements: ['اهتمام بالتحليلات', 'القدرة على تعلّم أدوات جديدة بسرعة'],
    url: 'https://example.com/careers/seo-growth-intern',
    skills: ['SEO', 'Digital Marketing', 'Data Analysis'],
    interests: ['Technology', 'Business'],
  },
  {
    title: 'متطوع مذيع إذاعة مجتمعية',
    location: 'حيفا',
    category: 'تطوع',
    description: 'استضف فقرة إذاعية أسبوعية تعرض أخبار الموسيقى والفنون المحلية.',
    requirements: ['الراحة في التحدث على الهواء', 'وقت أسبوعي ثابت'],
    url: 'https://example.com/volunteer/radio-host',
    skills: ['Public Speaking', 'Time Management'],
    interests: ['Music', 'Theater'],
  },
  {
    title: 'مدرب برنامج رقص للشباب',
    location: 'تل أبيب',
    category: 'تطوع',
    description: 'قد صفوف رقص أسبوعية للأطفال في مركز شباب مجتمعي.',
    requirements: ['خلفية في الرقص', 'خبرة العمل مع الأطفال ميزة إضافية'],
    url: 'https://example.com/volunteer/youth-dance-instructor',
    skills: ['Teaching', 'Time Management', 'Leadership'],
    interests: ['Dancing', 'Health & Fitness'],
  },
  {
    title: 'متطوع مدرب لياقة شخصي',
    location: 'إيلات',
    category: 'تطوع',
    description: 'قد جلسات لياقة مجانية في عطلة نهاية الأسبوع لأفراد المجتمع من جميع الأعمار.',
    requirements: ['خلفية أو شهادة في التدريب الرياضي'],
    url: 'https://example.com/volunteer/fitness-coach',
    skills: ['Leadership', 'Communication'],
    interests: ['Health & Fitness', 'Sports'],
  },
  {
    title: 'متدرب تسويق عقاري',
    location: 'القدس',
    category: 'تدريب',
    description: 'ادعم وكالة عقارية في تسويق العقارات والتواصل مع العملاء.',
    requirements: ['مهارات تواصل قوية', 'اهتمام بسوق العقارات'],
    url: 'https://example.com/careers/real-estate-marketing-intern',
    skills: ['Marketing', 'Sales', 'Communication'],
    interests: ['Real Estate', 'Business'],
  },
  {
    title: 'متطوع مرشد في متحف تاريخي',
    location: 'القدس',
    category: 'تطوع',
    description: 'قد جولات إرشادية وابحث في محتوى المعارض في متحف تاريخي محلي.',
    requirements: ['مهارات خطابة قوية', 'اهتمام بالبحث التاريخي'],
    url: 'https://example.com/volunteer/museum-docent',
    skills: ['Public Speaking', 'Teaching', 'Research'],
    interests: ['History', 'Education'],
  },
  {
    title: 'ميسّر نادي نقاش الفلسفة وعلم النفس',
    location: 'عن بُعد',
    category: 'تطوع',
    description: 'يسّر جلسات نقاش أسبوعية عبر الإنترنت حول مواضيع الفلسفة وعلم النفس مع زملاء طلاب.',
    requirements: ['مهارات قوية في تيسير النقاش', 'اهتمام حقيقي بالمواضيع'],
    url: 'https://example.com/volunteer/discussion-club-facilitator',
    skills: ['Public Speaking', 'Critical Thinking', 'Communication'],
    interests: ['Philosophy', 'Psychology'],
  },
  {
    title: 'متطوع توعية لحملة محلية',
    location: 'تل أبيب',
    category: 'تطوع',
    description: 'ساعد حملة مدنية محلية في التواصل من باب إلى باب وفعاليات مجتمعية.',
    requirements: ['الراحة في التواصل مع الجمهور', 'توفر موثوق في عطلة نهاية الأسبوع'],
    url: 'https://example.com/volunteer/campaign-outreach',
    skills: ['Communication', 'Marketing'],
    interests: ['Politics', 'Volunteering'],
  },
  {
    title: 'برنامج محتوى مدوّن سفر',
    location: 'عن بُعد',
    category: 'عمل حر',
    description: 'اكتب وصوّر قصص سفر لمنصة إعلامية متنامية في مجال السفر.',
    requirements: ['نماذج كتابة', 'استعداد للسفر أحياناً'],
    url: 'https://example.com/careers/travel-blogger-program',
    skills: ['Writing', 'Photography', 'Content Creation'],
    interests: ['Travel', 'Writing'],
  },
  {
    title: 'مرشد نادي تصميم الألعاب',
    location: 'عن بُعد',
    category: 'إرشاد مهني',
    description: 'أرشد نادي تصميم ألعاب في مدرسة ثانوية أثناء بناء أول نموذج أولي لعبتهم المستقلة.',
    requirements: ['خبرة في البرمجة أو تصميم الألعاب'],
    url: 'https://example.com/volunteer/game-design-mentor',
    skills: ['Programming', 'Creativity', 'Problem Solving'],
    interests: ['Gaming', 'Technology'],
  },
  {
    title: 'متطوع طاقم إنتاج مسرحي',
    location: 'حيفا',
    category: 'تطوع',
    description: 'انضم إلى طاقم خلف الكواليس لموسم الإنتاج القادم لمسرح مجتمعي.',
    requirements: ['متوفر لبروفات مسائية', 'روح العمل الجماعي'],
    url: 'https://example.com/volunteer/theater-crew',
    skills: ['Time Management', 'Creativity', 'Teamwork'],
    interests: ['Theater', 'Arts'],
  },
  {
    title: 'متطوع مساعد طاهٍ في مطبخ مجتمعي',
    location: 'تل أبيب',
    category: 'تطوع',
    description: 'ساعد كبار الطهاة في تحضير وجبات لمطبخ مجتمعي يخدم عائلات محتاجة.',
    requirements: ['مهارات مطبخ أساسية', 'توفر أسبوعي'],
    url: 'https://example.com/volunteer/community-kitchen',
    skills: ['Cooking', 'Teamwork', 'Time Management'],
    interests: ['Food & Dining', 'Health & Fitness'],
  },
  {
    title: 'زمالة فرصة العامة - برنامج متعدد المسارات',
    location: 'عن بُعد',
    category: 'زمالة',
    description: 'زمالة مفتوحة متعددة المسارات تشمل التكنولوجيا والأعمال والفنون والعلوم والأثر المجتمعي. نرحب بالطلاب من جميع التخصصات والخلفيات في برنامج مرن وذاتي الوتيرة مع إرشاد وعمل على مشاريع وفرص تواصل مصممة حسب اهتماماتك.',
    requirements: ['طالب حالياً أو خريج حديث', 'بضع ساعات أسبوعياً من التوفر', 'مفتوح لأي خلفية أو مهارة'],
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
