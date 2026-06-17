# Implementation Notes — Walkam Dark (וולקאם)

הנחיות הטמעה למפתח / Claude Code / Codex. המטרה: להחיל את העיצוב הכהה (עיצוב A)
על האפליקציה הקיימת **בלי לשבור לוגיקה**, כשכבת Design System אחת נקייה.

---

## 0. עקרון על
זהו **שדרוג ויזואלי בלבד**. אתה מחליף סגנון, לא בונה אפליקציה חדשה.
העיצוב המצורף הוא **reference** — שחזר את המראה, אל תעתיק את ה-HTML שלו 1:1 לתוך הקוד הקיים.

---

## 1. גבולות — מה אסור לגעת (DO NOT)
- ❌ **אל תשנה לוגיקה עסקית** — hooks, reducers, services, חישובים, state management.
- ❌ **אל תשנה routes / ניווט** — אותם נתיבים, אותם שמות מסכים, אותו עץ ניווט.
- ❌ **אל תיגע ב-Supabase / Auth** — schema, queries, RLS, session, providers — ללא שינוי.
- ❌ אל תשנה שמות props/אירועים של קומפוננטות קיימות (רק את ה-styling שלהן).
- ❌ אל תוסיף תלויות כבדות (UI kit חיצוני). מותר: עזרי טוקנים/clsx/גופן בלבד.
- ❌ אל תשבור את ה-data flow הקיים (טעינה/שגיאה/ריק נשארים מאותם מקורות).

## 2. מה כן (DO)
- ✅ הטמע **קודם את דף הבית בלבד** (Home). אל תיגע במסכים אחרים בשלב זה.
- ✅ בנה **שכבת Design System אחת** מרוכזת (ראה §3) וצרוך ממנה.
- ✅ שמור על **עברית מלאה ו-RTL** בכל מקום (ראה §5).
- ✅ השתמש ב-`design-tokens.json` כמקור אמת יחיד לצבעים/מרווחים/טיפוגרפיה.
- ✅ עטוף החלפות סגנון כך שניתן להחזירן (feature flag / theme) אם צריך.

---

## 3. שכבת Design System (מבנה מומלץ)
```
src/design-system/
  tokens.css        // :root עם CSS variables מתוך design-tokens.json
  theme.ts          // (אופציונלי) ייצוא טיפוסי של הטוקנים
  components/
    Button.*        // Primary / Accent / Icon
    Card.*          // Widget Card (dark + color variants)
    Header.*
    BottomNav.*
    BottomSheet.*
    Input.*
    SectionTitle.*
    EmptyState.*
    Skeleton.* / Spinner.*
```
- המר את `design-tokens.json` ל-CSS variables ב-`:root` (למשל `--color-brand-primary: #FF2E9A;`).
- **אסור hex/מספרים קשיחים** בקומפוננטות — רק `var(--…)`.
- אם הפרויקט ב-Tailwind: מפה את הטוקנים ל-`theme.extend` (colors/spacing/borderRadius/boxShadow/fontFamily) במקום ערכים ישירים.

---

## 4. סדר עבודה מומלץ
1. הוסף גופן **Rubik** (400–900) ל-`<head>` או דרך הבאנדלר.
2. צור `tokens.css` והזרק אותו ברמת השורש. הגדר `body { direction: rtl; font-family: Rubik; background: var(--color-bg-app); }`.
3. בנה קומפוננטות ה-DS לפי `components-spec.md`.
4. החלף את ה-styling של **דף הבית** הקיים כך שיצרוך את קומפוננטות ה-DS — בלי לשנות את ה-data/handlers שלו.
5. ודא שכל מצב קיים (loading/empty/error) מקבל את הווריאנט הכהה.
6. בדיקת קבלה לפי הצ׳ק-ליסט ב-`design-spec.md` §5.

> אל תמשיך למסכים נוספים עד אישור דף הבית.

---

## 5. RTL & עברית (חובה)
- `dir="rtl"` ברמה הגבוהה ביותר; אל תסתמך על דפדפן.
- השתמש בתכונות **לוגיות**: `margin-inline`, `padding-inline`, `inset-inline-*`, `text-align: start/end`. הימנע מ-`left/right` קשיח.
- חיצים: "המשך/קדימה" → מצביע שמאלה; "חזרה" → ימינה.
- ספרות/מטבע: ודא bidi תקין (`unicode-bidi: plaintext` היכן שמספרים מעורבים בטקסט עברי).
- אל תהפוך אייקונים שאינם כיווניים (בית, פעמון, מתנה) — רק אלמנטים כיווניים.

---

## 6. מיפוי לקומפוננטות קיימות
- זהה את קומפוננטות דף הבית הקיימות והחלף **רק** את שכבת התצוגה/סגנון שלהן בקומפוננטות ה-DS.
- אם קומפוננטה קיימת מקבלת `children`/`props` — שמר את אותו חוזה; רק עטוף/החלף classes/styles.
- אל תיצור כפילויות לוגיות; קומפוננטת ה-DS היא "טיפש" (presentational) ומקבלת data מבחוץ.

---

## 7. בדיקות לפני מסירה
- אין שינוי ב-routes/auth/queries (diff נקי באזורים האלה).
- דף הבית נראה כמו ה-reference במובייל (390px) וממורכז בדסקטופ.
- מצבי loading/empty/error עובדים מאותם מקורות נתונים.
- Lighthouse/contrast: טקסט לבן על surface ≥ AA.
- אין hex/מספרי spacing קשיחים מחוץ ל-`tokens.css`.

---

## 8. קבצים בחבילה
- `design-tokens.json` — מקור אמת לטוקנים.
- `design-spec.md` — layout, screens, assets, RTL.
- `components-spec.md` — מפרט קומפוננטות + states.
- `implementation-notes.md` — מסמך זה.

המלצה ל-Codex: קרא בסדר — notes → tokens → components → spec. התחל מ-`tokens.css`, ואז דף הבית בלבד.
