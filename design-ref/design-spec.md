# Design Spec — Walkam Dark (וולקאם)

מסמך עיצוב למסך הבית ולמסכים הנגזרים, מבוסס על עיצוב **A** (הכהה הקלאסי).
קרא לצד `design-tokens.json` ו-`components-spec.md`. כיוון **RTL**, גופן **Rubik**.

---

## 1. שפת עיצוב — סיכום
- **רקע כהה** (`app` #181A23) עם כרטיסים בגוון מעט בהיר (`surface` #252836).
- **ורוד חם** (`brand.primary` #FF2E9A) כצבע פעולה ראשי + מצב פעיל בניווט.
- **ליים** (`brand.accent` #D8F500) ל-CTA חיובי בודד (צ׳ק-אין).
- **צבעי קטגוריה פסטליים** (pink/mint/peach/rose) להדגשת תוכן צבעוני.
- צורות: **pills** מלאים לכפתורים, כרטיסים ב-radius 20px, אייקונים בעיגול.
- טיפוגרפיה עברית מודגשת, מספרים גדולים, יישור ימני.

---

## 2. Layout Specs

### 2.1 מבנה דף הבית (מלמעלה למטה)
1. **Status Bar** — גובה 52px (פלטפורמה; לא חלק מה-DS).
2. **Header** — בורר מועדון (ימין) + פעולות חיפוש/צ׳אט/פרופיל (שמאל).
3. **Hero / Carousel** — באנר אירוע, גובה 166px, radius 26px, + נקודות פגינציה.
4. **Quick Actions** — גריד 4 עמודות של אריחים (כל הפעולות / רעיון / מידע / קשר).
5. **Check-in Card** — סטטוס מועדון + כפתור צ׳ק-אין (ליים).
6. **Section Title** — "מה חדש" + קישור "הכל".
7. **Feed Grid** — כרטיסי וידג׳ט ב-2 עמודות.
8. **Bottom Nav** — קבוע, 4 פריטים + Home indicator.

### 2.2 Grid של הווידג׳טים
- **מובייל (ברירת מחדל):** 2 עמודות, `gap: 11px`, כרטיס בגובה מינ׳ 128px.
- **Quick Actions:** `grid-template-columns: repeat(4, 1fr)`, `gap: 11px`.
- **Feed:** `grid-template-columns: 1fr 1fr`. אם פריט בולט — מותר span 2 עמודות.
- מחוץ לגריד: שוליים אופקיים `22px` (gutter) בכל אזור.

### 2.3 מרווחים בין אזורים
| מעבר | מרווח |
|---|---|
| Header ← תוכן | 14px |
| Hero ← נקודות | 12px |
| נקודות ← Quick Actions | 8px |
| Quick Actions ← Check-in | 14px |
| Check-in ← Section Title | 16px |
| Section Title ← Feed | 12px |
| Feed ← Bottom Nav | ≥24px (כולל מרווח גלילה) |

### 2.4 התאמה למובייל
- מיכל מקסימלי 430px, gutter 22px, גריד 2 עמודות.
- Bottom Nav קבוע (`position: sticky/fixed bottom`), כולל `padding-bottom: env(safe-area-inset-bottom)`.
- כל hit target ≥ 44px.

### 2.5 התאמה לדסקטופ (responsive scale-up)
- **breakpoints:** `sm <640`, `md 640–1024`, `lg >1024`.
- התוכן נשאר במיכל ממורכז ברוחב מקס׳ **560px** (חוויית "אפליקציה" — לא למתוח לרוחב מלא).
- מ-`md` ומעלה: Feed יכול לעבור ל-3 עמודות; Quick Actions נשאר 4.
- ה-Bottom Nav יכול להפוך ל-**Side Nav** אנכי בצד ימין מ-`lg` (אופציונלי), עם אותם 4 פריטים ואותו צבע פעיל.
- Hero גדל פרופורציונלית; שמור יחס ~2.4:1.

### 2.6 התנהגות RTL
- `dir="rtl"` ברמת השורש; כל הטקסט `text-align: right`.
- **לוגי במקום פיזי:** השתמש ב-`margin-inline`, `padding-inline`, `inset-inline-start/end` — לא ב-left/right קשיח.
- אייקון מוביל ממוקם **מימין** לטקסט (ב-flex עם `flex-direction: row` תחת RTL זה אוטומטי).
- chevrons/חיצים של "קדימה" מצביעים **שמאלה** (←); "חזרה" מצביע ימינה (→).
- מספרים ומטבע (₪) — RTL-aware: סכום מוצג עם ₪ בצד הנכון; ספרות תמיד LTR בתוך bidi (`unicode-bidi: plaintext` במידת הצורך).
- carousel/סליידרים: גלילה מתחילה מימין; נקודה פעילה ראשונה = מימין.
- מצבי hover/active לא תלויי כיוון.

---

## 3. Screens (תיאורי מסכים)

### 3.1 דף הבית (Home)
ראה סעיף 2.1. תוכן דינמי: Hero מ-CMS/promotions, Feed מרשימת פריטים (אירוע/עדכון/סקר/הטבה), Check-in מסטטוס מועדון בזמן אמת.
מצבים: טעינה → Skeleton לכל אזור; ריק → Empty State באזור הפיד; שגיאה → ראה 3.7.

### 3.2 מסך התחברות (Login)
- רקע `app` #181A23, תוכן ממורכז אנכית, gutter 22px.
- לוגו וולקאם למעלה (ראה Assets).
- כותרת h1 "ברוכים הבאים" + תת-כותרת body #9CA0AE.
- **Inputs:** טלפון/אימייל + קוד/סיסמה (קומפוננטת Input, RTL).
- **CTA ראשי:** כפתור Primary ברוחב מלא "התחברות".
- קישורים משניים (text.link): "שכחתי סיסמה", "הרשמה".
- מצבים: שגיאת אימות → Input error + הודעת error; שליחה → כפתור loading.

### 3.3 עמוד תוכן / אירוע / הטבה (Detail)
- **Hero עליון:** תמונה/גרדיאנט מלא רוחב, גובה ~280px, radius תחתון 28px, כפתור "חזרה" (Icon, חץ →) בפינה עליונה ימין.
- **גוף:** כותרת h1 + מטא (תאריך/מיקום, caption #9CA0AE) + טקסט body.
- **כרטיסי מידע** (surface) לפי הצורך.
- **CTA דביק תחתון:** Bar ברקע navBar עם כפתור Accent/Primary ברוחב מלא ("הרשמה לאירוע" / "מימוש הטבה").
- וריאנט הטבה: תג קטגוריה (chip צבעוני) + קוד קופון בכרטיס surfaceAlt.

### 3.4 Bottom Sheet לדוגמה
- טריגר: לחיצה על פריט פיד / "כל הפעולות".
- מבנה: Grabber → כותרת h2 + סגירה → רשימת פעולות/תוכן → כפתור Primary תחתון.
- ראה Component #4 למידות, צללים ואנימציה.

### 3.5 מסך טעינה (Loading / Splash)
- **Splash:** רקע `app`, לוגו ממורכז, ספינר `brand.primary` 24px מתחתיו.
- **טעינת תוכן בתוך מסך:** Skeleton בצורת הקומפוננטות (Hero, אריחים, כרטיסי פיד) עם shimmer.

### 3.6 מצב ריק (Empty)
- ראה Component #8. דוגמאות: פיד ריק ("אין עדיין עדכונים"), הטבות ריקות, חיפוש ללא תוצאות.

### 3.7 מצב שגיאה (Error)
- **אזורי:** בתוך כרטיס/אזור — אייקון error 40px (`state.error`), כותרת title, תיאור body #9CA0AE, כפתור "נסו שוב" (Primary).
- **גלובלי (אין רשת):** מסך מלא עם אותו מבנה + כפתור "רענון".
- **Inline (טופס):** הודעת error מתחת ל-Input בצבע `state.error`.
- **Toast:** רצועה עליונה זמנית, רקע `state.errorBg`, טקסט error, נעלמת אחרי ~4s.

---

## 4. Assets

| שם asset | שימוש | גודל מומלץ | חובה? |
|---|---|---|---|
| `logo-walkam-full` | Login, Splash, Header (אופציונלי) | SVG (גובה 32–40px) | חובה |
| `logo-walkam-mark` | Favicon, Side Nav, אווטאר ברירת מחדל | SVG / 512×512 PNG | חובה |
| אייקוני UI (search, chat, user, plus, bulb, clipboard, phone, calendar, megaphone, home, gift, bell, chevron) | Header, Quick Actions, Feed, Nav | SVG stroke 2px, viewBox 24×24, `currentColor` | חובה |
| `hero-event-*` | באנרי Hero / Carousel | 1200×500 (יחס ~2.4:1), JPG/WebP | אופציונלי (יש fallback גרדיאנט) |
| `detail-cover-*` | Hero בעמוד אירוע/הטבה | 1200×800, WebP | אופציונלי |
| `avatar-placeholder` | פרופיל ללא תמונה | 96×96 PNG/SVG | אופציונלי |
| `empty-illustration` | מצב ריק | SVG 64–120px | אופציונלי |
| `partner-logo-*` (למשל Bona) | כרטיסי הטבה | SVG/PNG, גובה ~24px | אופציונלי |

**הערות assets**
- אייקונים: סט אחיד (stroke 2px) — מומלץ Lucide/Feather. צבע נשלט ע״י `currentColor` כדי לעבוד עם טוקנים.
- תמונות Hero: תמיד עם שכבת gradient כהה מלמטה כדי שטקסט לבן יישאר קריא; אם אין תמונה — fallback `radial-gradient` כהה (כמו בעיצוב).
- לוגו: ספק גרסה בהירה (לבן) לרקע כהה.

---

## 5. צ׳ק-ליסט קבלה (Acceptance)
- [ ] RTL מלא, אין left/right קשיח ששובר כיוון.
- [ ] כל הצבעים/מרווחים מטוקנים בלבד (אין hex מפוזר בקוד).
- [ ] גופן Rubik נטען עם משקלי 400–900.
- [ ] hit targets ≥ 44px.
- [ ] Skeleton + Empty + Error קיימים בפיד.
- [ ] Bottom Nav עם safe-area, פריט "בית" פעיל.
- [ ] מתאים 360–430px מובייל, וממורכז עד 560px בדסקטופ.
