// One-off seed script: populates the Appwrite "opportunities" collection with
// fake opportunities that overlap the real skills/interests option lists
// (see Buildprofileskills.jsx / Buildprofileinterests.jsx) so profile matching
// in TopMatches has something to match against.
//
// Content is in Arabic. skills/interests values are intentionally left in
// English since they must match the exact chip values used by the profile
// builder screens for match scoring. This only affects documents created by
// a fresh run of this script - it does not modify any English-language
// documents already seeded in the live database.
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
    title: 'تدريب مطوّر واجهات أمامية مبتدئ',
    location: 'تل أبيب',
    category: 'تدريب',
    description: 'اعمل مع فريق المنتج لدينا في بناء ميزات موجهة للعملاء باستخدام React. خطوة أولى رائعة للطلاب المهتمين باستكشاف تطوير الويب.',
    requirements: ['معرفة أساسية بلغة JavaScript', 'إلمام بـ HTML/CSS', 'مسجَّل حالياً في برنامج أكاديمي'],
    url: 'https://example.com/careers/frontend-intern',
    skills: ['Programming', 'Web Development', 'Problem Solving'],
    interests: ['Technology'],
  },
  {
    title: 'برنامج إرشاد في تصميم UI/UX',
    location: 'عن بُعد',
    category: 'إرشاد مهني',
    description: 'برنامج إرشاد مدته 10 أسابيع يقرنك بمصمم منتج أول لبناء دراسة حالة جاهزة لمعرض أعمالك.',
    requirements: ['معرض أعمال أو نماذج تصميم', 'يُفضَّل خبرة في Figma'],
    url: 'https://example.com/careers/ux-mentorship',
    skills: ['UI/UX Design', 'Design', 'Creativity'],
    interests: ['Arts', 'Technology'],
  },
  {
    title: 'متطوع مدرب رياضي مجتمعي',
    location: 'حيفا',
    category: 'تطوع',
    description: 'درّب فرقاً شبابية مرتين أسبوعياً في مركزنا المجتمعي. لا حاجة لشهادة تدريب، فقط الحماس.',
    requirements: ['توفر موثوق في أمسيات أيام الأسبوع'],
    url: 'https://example.com/volunteer/sports-coach',
    skills: ['Leadership', 'Teamwork', 'Communication'],
    interests: ['Sports', 'Volunteering'],
  },
  {
    title: 'متدرب تسويق ووسائل تواصل اجتماعي',
    location: 'القدس',
    category: 'تدريب',
    description: 'ساعد في التخطيط وتنفيذ حملات على إنستغرام وتيك توك لمؤسسة غير ربحية سريعة النمو.',
    requirements: ['مستخدم نشط لوسائل التواصل الاجتماعي', 'مهارات أساسية في إنشاء المحتوى'],
    url: 'https://example.com/careers/marketing-intern',
    skills: ['Marketing', 'Digital Marketing', 'Social Media', 'Content Creation'],
    interests: ['Business', 'Technology'],
  },
  {
    title: 'مساعد بحث في تحليل البيانات',
    location: 'عن بُعد',
    category: 'بحث',
    description: 'ادعم فريق بحث جامعي في تنظيف وتحليل بيانات الاستبيانات باستخدام جداول البيانات والإحصاء الأساسي.',
    requirements: ['إتقان Excel أو Google Sheets', 'اهتمام بالتفاصيل'],
    url: 'https://example.com/research/data-assistant',
    skills: ['Data Analysis', 'Research', 'Critical Thinking'],
    interests: ['Science', 'Education'],
  },
  {
    title: 'معسكر تدريبي على عرض المشاريع الناشئة',
    location: 'تل أبيب',
    category: 'ورشة عمل',
    description: 'معسكر تدريبي لعطلة نهاية الأسبوع يعلّم المؤسسين الجدد كيفية بناء وعرض نموذج أولي للمستثمرين.',
    requirements: ['فكرة أو اهتمام بريادة الأعمال'],
    url: 'https://example.com/events/pitch-bootcamp',
    skills: ['Public Speaking', 'Project Management', 'Leadership'],
    interests: ['Entrepreneurship', 'Business', 'Finance'],
  },
  {
    title: 'متطوع تصوير للفعاليات المحلية',
    location: 'حيفا',
    category: 'تطوع',
    description: 'وثّق الفعاليات وورش العمل المجتمعية لمواد التسويق الخاصة بمؤسستنا غير الربحية.',
    requirements: ['كاميرا خاصة أو هاتف ذكي بجودة مناسبة', 'معرض أعمال لصور سابقة'],
    url: 'https://example.com/volunteer/photography',
    skills: ['Photography', 'Creativity'],
    interests: ['Photography', 'Arts', 'Volunteering'],
  },
  {
    title: 'متدرب دعم العملاء',
    location: 'عن بُعد',
    category: 'تدريب',
    description: 'تعلّم أساسيات نجاح العملاء من خلال التعامل مع طلبات دعم حقيقية تحت إشراف مرشد.',
    requirements: ['إتقان جيد للكتابة بالإنجليزية', 'الصبر والتعاطف'],
    url: 'https://example.com/careers/support-trainee',
    skills: ['Customer Service', 'Communication', 'Problem Solving'],
    interests: ['Business'],
  },
  {
    title: 'يوم تطوعي لتنظيف البيئة',
    location: 'إيلات',
    category: 'تطوع',
    description: 'انضم إلى مبادرة تنظيف الشاطئ والشعاب المرجانية بالشراكة مع مجموعات بيئية محلية.',
    requirements: ['القدرة على حضور فعالية خارجية ليوم كامل'],
    url: 'https://example.com/volunteer/beach-cleanup',
    skills: ['Teamwork'],
    interests: ['Environment', 'Nature', 'Outdoor Activities', 'Volunteering'],
  },
  {
    title: 'سلسلة ورش تطوير تطبيقات الجوال',
    location: 'عن بُعد',
    category: 'ورشة عمل',
    description: 'سلسلة من 6 جلسات تعلّم أساسيات React Native من خلال بناء تطبيق صغير من الصفر.',
    requirements: ['خلفية برمجية أساسية مفيدة لكن غير ضرورية'],
    url: 'https://example.com/events/mobile-dev-workshop',
    skills: ['Programming', 'Mobile Development', 'Web Development'],
    interests: ['Technology'],
  },
  {
    title: 'تدريب كتابة محتوى',
    location: 'القدس',
    category: 'تدريب',
    description: 'اكتب تدوينات ونشرات إخبارية ونصوصاً لوسائل التواصل لشركة ناشئة في مجال التعليم التقني.',
    requirements: ['نماذج كتابة قوية', 'القدرة على العمل ضمن مواعيد نهائية ضيقة'],
    url: 'https://example.com/careers/content-writer',
    skills: ['Writing', 'Content Creation', 'Communication'],
    interests: ['Education', 'Reading'],
  },
  {
    title: 'متطوع مساعد في صف طبخ',
    location: 'تل أبيب',
    category: 'تطوع',
    description: 'ساعد طاهياً يدير صفوف طبخ أسبوعية مجانية للشباب الأقل حظاً في المجتمع.',
    requirements: ['معرفة أساسية بسلامة المطبخ', 'توفر أسبوعي'],
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
