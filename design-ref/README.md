# Handoff: Walkam (וולקאם) — Dark Theme Redesign

> חבילה זו נועדה ל-**Claude Code** כדי להחיל עיצוב כהה חדש על האפליקציה הקיימת,
> **תוך החלפת העיצוב הקיים** — בלי לגעת בלוגיקה, ניווט או נתונים.

---

## Overview
שדרוג ויזואלי של אפליקציית וולקאם לעיצוב **כהה** (רקע נייבי כהה, ורוד חם כצבע פעולה, ליים ל-CTA, צבעי קטגוריה פסטליים). העיצוב מבוסס על מסך הבית. כיוון **RTL**, עברית מלאה, גופן **Rubik**.

## About the Design Files — חשוב לקרוא
- הקובץ `reference/home-screen.dc.html` הוא **reference עיצובי בלבד** — פרוטוטייפ ב-HTML שמראה את המראה וההתנהגות הרצויים. **אין להעתיק אותו 1:1** לקוד.
- המשימה: **לשחזר את המראה הזה בתוך הסביבה הקיימת של האפליקציה** (React/Vue/RN/וכו׳) לפי הדפוסים והספריות הקיימים שלה.
- **זה לא חבילה מקובעת.** הטוקנים והמפרטים הם הבסיס; אתה (Claude Code) קורא את ה-reference, מבין את הכוונה, ובונה קומפוננטות גמישות שמונעות מטוקנים — לא ערכים קשיחים. עיצוב נוסף שיתווסף לאפליקציה אמור להמשיך לצרוך את אותם טוקנים ולהיראות עקבי.

## Fidelity
**High-fidelity.** הצבעים, הטיפוגרפיה, המרווחים והעיגולים סופיים ומדויקים (ראה `design-tokens.json` / `tokens.css`). שחזר ברמת דיוק גבוהה באמצעות הספריות והדפוסים הקיימים בקוד.

---

## איך לעבוד עם החבילה (סדר מומלץ ל-Claude Code)
1. קרא `implementation-notes.md` — **הגבולות** (מה אסור לגעת) והסדר.
2. הטמע `tokens.css` (או מפה ל-Tailwind `theme.extend`) כמקור אמת יחיד לצבעים/מרווחים/טיפוגרפיה.
3. קרא `components-spec.md` — מפרט כל קומפוננטה + states.
4. קרא `design-spec.md` — layout, גריד, מסכים, assets, RTL.
5. פתח את `reference/home-screen.dc.html` כדי לראות את התוצאה הרצויה.
6. הטמע **קודם את דף הבית בלבד**; אל תמשיך עד אישור.

---

## גבולות נוקשים (DO NOT)
- ❌ אל תשנה **לוגיקה עסקית** (hooks/services/state/חישובים).
- ❌ אל תשנה **routes / ניווט**.
- ❌ אל תיגע ב-**Supabase / Auth** (schema, queries, RLS, session).
- ❌ אל תשנה חוזי props/אירועים של קומפוננטות קיימות — רק את שכבת התצוגה/סגנון.
- ❌ אל תפזר hex/px בקוד — רק `var(--token)`.
- ✅ בנה **שכבת Design System אחת** נקייה שכולם צורכים ממנה.
- ✅ שמור **RTL מלא ועברית** בכל מקום (תכונות לוגיות: `margin-inline`, `inset-inline-*`, `text-align: start/end`).

---

## Screens / Views

### דף הבית (Home) — להטמעה ראשונה
**Purpose:** מסך נחיתה — באנר אירוע, פעולות מהירות, סטטוס צ׳ק-אין, פיד "מה חדש".
**Layout (מלמעלה למטה):** Header → Hero/Carousel → Quick Actions (גריד 4) → Check-in Card → Section Title → Feed Grid (2 עמודות) → Bottom Nav קבוע. Gutter אופקי 22px, מרווח אזורים 16px, מרווח כרטיסים 11px.
**Components:** ראה `components-spec.md`. כל המידות/הצבעים/הטיפוגרפיה המדויקים שם וב-`design-tokens.json`.

### מסכים נגזרים (לשלבים הבאים, לא עכשיו)
התחברות · עמוד אירוע/הטבה · Bottom Sheet · טעינה · ריק · שגיאה — מתוארים ב-`design-spec.md` §3.

---

## Interactions & Behavior
- **Carousel:** גלילה אופקית מימין; נקודה פעילה ראשונה מימין; ורודה (`--color-primary`).
- **Quick Actions / Cards:** לחיצה → ניווט/Bottom Sheet (לפי הלוגיקה הקיימת). hover/active מתוארים לכל קומפוננטה.
- **Bottom Sheet:** slide-in מלמטה, `--motion-slow` + `--ease`, scrim ב-fade.
- **Loading/Empty/Error:** מאותם מקורות נתונים קיימים; וריאנט כהה (Skeleton/EmptyState/Error) ב-`components-spec.md`.
- **Responsive:** מובייל 360–430px; דסקטופ — מיכל ממורכז עד 560px (חוויית אפליקציה, לא מתיחה לרוחב מלא).

## State Management
אין דרישות state חדשות. השתמש ב-state/data הקיימים; הקומפוננטות החדשות הן presentational ומקבלות data מבחוץ. מצבי loading/empty/error נקבעים מאותם flags קיימים.

## Design Tokens
ראה `tokens.css` (מוכן לשימוש) ו-`design-tokens.json` (מקור אמת מובנה). מסכם: ורוד `#FF2E9A`, ליים `#D8F500`, רקע אפליקציה `#181A23`, surface `#252836`, טקסט `#FFFFFF`/`#9CA0AE`, radius 20px לכרטיסים / pill לכפתורים, מרווחים בסקאלה 2–48px, Rubik 400–900.

## Assets
ראה `design-spec.md` §4 (לוגו, אייקוני UI ב-stroke 2px / 24px, באנרים). אם אין assets — יש fallback גרדיאנט ל-Hero. אייקונים: סט אחיד (Lucide/Feather) עם `currentColor`. השתמש בלוגו/assets הקיימים בקוד אם קיימים.

## Files (בחבילה)
- `README.md` — מסמך זה (כניסה).
- `tokens.css` — משתני CSS מוכנים להטמעה.
- `design-tokens.json` — מקור אמת מובנה לטוקנים.
- `components-spec.md` — מפרט 9 קומפוננטות + states.
- `design-spec.md` — layout, מסכים, assets, RTL, צ׳ק-ליסט קבלה.
- `implementation-notes.md` — גבולות והנחיות הטמעה.
- `reference/home-screen.dc.html` — ה-reference העיצובי (לצפייה/השוואה, לא להעתקה).

> מסמך זה עצמאי — מפתח שלא היה בשיחה יכול להטמיע ממנו לבד.
