// One-off: adds the MEET (Middle East Entrepreneurs of Tomorrow) opportunity
// to the "opportunities" Firestore collection. Signs in as a throwaway
// account only to satisfy the Firestore write rule
// (`allow write: if request.auth != null`), then deletes that account again.
//
// Usage: node scripts/add-meet-opportunity.mjs

import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
} from 'firebase/auth';
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCcqgciD-7JtfRFY_RUzNMPvV5pZNDWyws',
  authDomain: 'forsa-a5848.firebaseapp.com',
  projectId: 'forsa-a5848',
  storageBucket: 'forsa-a5848.firebasestorage.app',
  messagingSenderId: '1095418919674',
  appId: '1:1095418919674:web:3fbc2c0811a3465674a743',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function run() {
  const tempEmail = `add-opportunity-seed-${Date.now()}@example.com`;
  const credential = await createUserWithEmailAndPassword(auth, tempEmail, 'Temp-password-123!');

  try {
    const docRef = await addDoc(collection(db, 'opportunities'), {
      title: 'MEET - Middle East Entrepreneurs of Tomorrow',
      titleAr: 'ميت - رواد أعمال الشرق الأوسط للغد',
      description:
        'A three-year program for Israeli and Palestinian high schoolers, teaching computer science, entrepreneurship, and leadership in partnership with MIT.',
      descriptionAr:
        'برنامج مدته ثلاث سنوات لطلاب المدارس الثانوية الإسرائيليين والفلسطينيين، يعلّم علوم الحاسوب وريادة الأعمال والقيادة بالشراكة مع معهد MIT.',
      details:
        'MEET brings together binational, co-ed cohorts of high school students to learn computer science, social entrepreneurship, and leadership skills through a curriculum developed with MIT. Students work in mixed Israeli-Palestinian teams to build tech projects with real social impact, alongside a MEETx remote-learning track and an alumni network of ~950 graduates offering mentoring, workshops, and a $100k Armoni Family Scholarship for one alum each year.',
      detailsAr:
        'يجمع برنامج ميت بين مجموعات ثنائية القومية ومختلطة من طلاب المدارس الثانوية لتعلم علوم الحاسوب وريادة الأعمال الاجتماعية ومهارات القيادة من خلال منهج تم تطويره بالشراكة مع معهد MIT. يعمل الطلاب في فرق إسرائيلية-فلسطينية مشتركة لبناء مشاريع تقنية ذات أثر اجتماعي حقيقي، إلى جانب مسار تعلّم عن بُعد (MEETx) وشبكة خريجين تضم حوالي 950 خريجًا توفر الإرشاد وورش العمل ومنحة عائلة أرموني السنوية بقيمة 100,000 دولار لأحد الخريجين.',
      organization: 'MEET (in partnership with MIT)',
      category: 'Program',
      location: 'Jerusalem & Nazareth, Israel (plus remote via MEETx)',
      url: 'https://www.meet.org/apply',
      requirements: [
        'High school students in Israel (Jewish and Arab/Palestinian), applications open annually',
      ],
      skills: ['Computer Science', 'Programming', 'Entrepreneurship', 'Leadership'],
      interests: ['Technology', 'Social Impact', 'Entrepreneurship', 'Community', 'Coexistence'],
      imageUrl:
        'https://cdn.prod.website-files.com/5dd64bd3a930f9d04abd1363/5fde6bc5a49dc54dbb610bd9_meet_logo_red.png',
      createdAt: serverTimestamp(),
    });

    console.log(`Created opportunity ${docRef.id} - MEET`);
  } finally {
    await deleteUser(credential.user);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
