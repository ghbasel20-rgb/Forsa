// Display-only Arabic labels for the fixed skills/interests catalogs
// (Buildprofileskills.jsx / Buildprofileinterests.jsx). The English string
// is always what gets stored in profile.skills/interests and matched
// against event/opportunity skills/interests arrays for scoring, so it must
// never be swapped for the translated label -- only the rendered text
// changes. Custom "Other" entries typed by the user have no entry here and
// just render as typed in both languages.
export const skillLabelsAr = {
  Programming: 'البرمجة',
  Design: 'التصميم',
  Writing: 'الكتابة',
  'Public Speaking': 'التحدث أمام الجمهور',
  Research: 'البحث',
  Marketing: 'التسويق',
  'Data Analysis': 'تحليل البيانات',
  'Project Management': 'إدارة المشاريع',
  Leadership: 'القيادة',
  Communication: 'التواصل',
  'Problem Solving': 'حل المشكلات',
  Creativity: 'الإبداع',
  Teamwork: 'العمل الجماعي',
  'Time Management': 'إدارة الوقت',
  'Critical Thinking': 'التفكير النقدي',
  'Digital Marketing': 'التسويق الرقمي',
  'Video Editing': 'مونتاج الفيديو',
  Photography: 'التصوير',
  Translation: 'الترجمة',
  Teaching: 'التدريس',
  Sales: 'المبيعات',
  'Customer Service': 'خدمة العملاء',
  Accounting: 'المحاسبة',
  'Web Development': 'تطوير الويب',
  'Mobile Development': 'تطوير تطبيقات الجوال',
  'UI/UX Design': 'تصميم واجهات وتجربة المستخدم',
  'Graphic Design': 'التصميم الجرافيكي',
  'Content Creation': 'إنشاء المحتوى',
  'Social Media': 'وسائل التواصل الاجتماعي',
  SEO: 'تحسين محركات البحث',
  Cooking: 'الطبخ',
  Other: 'أخرى',
};

export const interestLabelsAr = {
  Technology: 'التكنولوجيا',
  Arts: 'الفنون',
  Sports: 'الرياضة',
  Business: 'الأعمال',
  Science: 'العلوم',
  Music: 'الموسيقى',
  Travel: 'السفر',
  Gaming: 'الألعاب',
  Reading: 'القراءة',
  Cooking: 'الطبخ',
  Fashion: 'الموضة',
  'Health & Fitness': 'الصحة واللياقة البدنية',
  Photography: 'التصوير',
  'Movies & TV': 'الأفلام والتلفزيون',
  Nature: 'الطبيعة',
  Politics: 'السياسة',
  History: 'التاريخ',
  Philosophy: 'الفلسفة',
  Psychology: 'علم النفس',
  Education: 'التعليم',
  Environment: 'البيئة',
  Volunteering: 'التطوع',
  Entrepreneurship: 'ريادة الأعمال',
  Finance: 'التمويل',
  'Real Estate': 'العقارات',
  'Food & Dining': 'الطعام والمطاعم',
  'Outdoor Activities': 'الأنشطة الخارجية',
  Writing: 'الكتابة',
  Dancing: 'الرقص',
  Theater: 'المسرح',
  Languages: 'اللغات',
  Other: 'أخرى',
};

export const translateOption = (value, language, labels) =>
  (language === 'ar' && labels[value]) || value;
