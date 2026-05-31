// data.jsx — mock data + utilities · Hebrew RTL

const MEMBER = {
  name: 'עדה שטרן',
  firstName: 'עדה',
  tier: 'Prime',           // internal key
  tierHe: 'פריים',
  memberNo: 'KVN-2K6-4F71',
  since: '04/2024',
  events: 42,
  saved: '₪4.8k',
  met: 217,
};

const EVENTS = [
  {
    id: 'e1', day: '12', month: 'APR', when: 'הערב · 19:30',
    title: 'גג,', titleEm: 'באור נרות.',
    where: 'פלורנטין', going: 17, capacity: 24, plusOne: true,
    blurb: 'שבעה-עשר חברים. שולחן ארוך אחד. יין מהמקום באלנבי. הביאו את החברה שכל הזמן רציתם להתקשר אליה.',
    host: 'מארח: נועה כ.', tag: 'ארוחה',
    color: 'var(--magenta-500)',
  },
  {
    id: 'e2', day: '14', month: 'APR', when: 'שבת · 11:00',
    title: 'שחייה בבוקר,', titleEm: 'הרצליה.',
    where: 'חוף הרצליה', going: 8, capacity: 12, plusOne: false,
    blurb: 'קפה בחול אחרי. חליפת צלילה לא חובה אבל מומלצת.',
    host: 'מארחת: יעל ר.', tag: 'בחוץ',
    color: 'var(--cyan-400)',
  },
  {
    id: 'e3', day: '18', month: 'APR', when: 'רביעי · 20:00',
    title: 'פתיחה:', titleEm: 'טליה קיינן.',
    where: 'גלריה דביר', going: 23, capacity: 40, plusOne: true,
    blurb: 'צפייה פרטית לפני הפתיחה לציבור. האמנית נמצאת.',
    host: 'בשיתוף גלריה דביר', tag: 'אמנות',
    color: 'var(--purple-500)',
  },
  {
    id: 'e4', day: '22', month: 'APR', when: 'ראשון · 09:00',
    title: 'ריצה איטית,', titleEm: 'קפה מהיר.',
    where: 'פארק הירקון', going: 6, capacity: 15, plusOne: false,
    blurb: '5 ק"מ בקצב נוח. אספרסו בר אחרי. ברוכים הבאים חברים חדשים.',
    host: 'מארח: עומר ל.', tag: 'בחוץ',
    color: 'var(--pink-500)',
  },
];

const PERKS = [
  { id: 'p1', biz: 'יינות פלורנטין', title: '20% הנחה,', titleEm: 'תמיד.', icon: 'wine', tag: 'מומלץ', saved: '₪320' },
  { id: 'p2', biz: 'אלנבי 40', title: 'קפה חופשי,', titleEm: 'חול.', icon: 'coffee', tag: '×12 שימושים' },
  { id: 'p3', biz: 'גלריה דביר', title: 'דילוג בתור,', titleEm: 'תמיד.', icon: 'ticket' },
  { id: 'p4', biz: 'מלון נורמן', title: '15% חדרים,', titleEm: 'אמצ"ש.', icon: 'key' },
  { id: 'p5', biz: 'בית העיר', title: 'סיורים פרטיים,', titleEm: 'חודשי.', icon: 'map' },
  { id: 'p6', biz: 'מייסדים בלבד', title: 'סופ"ש', titleEm: 'במעיינות.', icon: 'star', locked: true },
];

Object.assign(window, { MEMBER, EVENTS, PERKS });
