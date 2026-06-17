# Components Spec — Walkam Dark (וולקאם)

> מבוסס על עיצוב **A** של מסך הבית. כל הערכים תואמים ל־`design-tokens.json`.
> כיוון: **RTL**. גופן: **Rubik**. כל הצבעים/מרחקים מצוטטים כשמות טוקנים + ערך ליטרלי.

---

## עקרונות רוחב (חלים על כל הקומפוננטות)
- **Gutter** אופקי של המסך: `22px` (spacing.gutter).
- מרווח בין כרטיסים סמוכים: `11px` (spacing.cardGap).
- מרווח בין אזורים (sections): `16px` (spacing.sectionGap).
- כל אלמנט אינטראקטיבי: שטח לחיצה מינ׳ **44×44px**.
- ב־RTL: טקסט מיושר לימין, אייקון מוביל מימין לטקסט, צ׳יפים/שורות נפרשים מימין לשמאל.

---

## 1. Button

כפתור פעולה. שלושה סוגים: **Primary** (ורוד), **Accent** (ליים, ל־CTA חיובי כמו צ׳ק-אין), **Icon** (עיגול).

| מאפיין | Primary | Accent | Icon |
|---|---|---|---|
| שימוש | פעולה ראשית (חיפוש, אישור) | פעולה מודגשת/חיובית (צ׳ק-אין) | פעולת אייקון (צ׳אט, פרופיל) |
| גובה | 44px (padding `11px 18px`) | 40px (padding `10px 20px`) | 46×46px |
| radius | `pill` (999px) | `pill` (999px) | `circle` (50%) |
| רקע | `brand.primary` #FF2E9A | `brand.accent` #D8F500 | `brand.primary` או `surfaceAlt` |
| טקסט | `onPrimary` #FFFFFF, weight 700, 15px | `onAccent` #181A23, weight 800, 14px | — |
| אייקון | 17px, stroke #FFFFFF | 18px, stroke #181A23 | 20px |
| gap אייקון-טקסט | 8px | 8px | — |
| shadow | none (אופציונלי `glowPrimary`) | none | none |

**States**
- `default` — כמתואר.
- `hover` (דסקטופ) — רקע `primaryHover` #FF49A9 / `accentHover` #E4FF3A.
- `active`/pressed — רקע `primaryActive` #E01F84 / `accentActive` #BCD600, `transform: scale(0.97)`.
- `disabled` — רקע `primaryDisabled` #7A2E5C, טקסט `text.disabled` #5A5E6B, `cursor: not-allowed`, ללא צל.
- `loading` — טקסט מוחלף בספינר 18px (ראה Loading State), הכפתור נשאר ברוחב מלא, `pointer-events:none`.

---

## 2. Widget Card (כרטיס פיד / וידג׳ט)

כרטיס תוכן בגריד. וריאנט כהה (ברירת מחדל) ווריאנט צבעוני (קטגוריה).

| מאפיין | Dark variant | Color variant |
|---|---|---|
| שימוש | פריט פיד "מה חדש" | הדגשת קטגוריה/הטבה |
| רקע | `surface` #252836 | `category.*` (pink/mint/peach/rose/lime) |
| טקסט | primary #FFFFFF / secondary #9CA0AE | `onCategory` #181A23 |
| מידות | מינ׳ גובה 128px, רוחב = חצי גריד | גובה לפי תוכן |
| padding | 14px | 16–18px |
| radius | `md` (20px) | `md` (20px) |
| מבנה פנימי | שורה עליונה: אייקון (20px) + Badge; תחתית: תאריך (micro) + כותרת (cardTitle) | אייקון בריבוע 44px + טקסט |
| Badge | עיגול 26px, רקע `brand.primary`, טקסט #FFF weight 800 13px | אותו דבר |
| shadow | none (הפרדה ע״י צבע רקע) | none |

**States**
- `default` — כמתואר.
- `hover` — `surfaceAlt` #2F3344 (dark) / opacity 0.92 (color); `transform: translateY(-1px)`.
- `active` — `transform: scale(0.99)`.
- `disabled` — opacity 0.5, ללא pointer.
- `loading` — Skeleton: רקע surface עם shimmer (ראה Loading State).

---

## 3. Header (כותרת עליונה)

שורת ניווט עליונה מתחת ל-Status Bar.

- **גובה:** ~64px. **Padding:** `6px 22px 14px`.
- **מבנה (RTL):**
  - **ימין:** שם מועדון/בורר חשבון — טקסט 18px weight 700 #FFFFFF + chevron-down 16px.
  - **שמאל (קבוצת פעולות, gap 10px):** כפתור "חיפוש" (Primary pill) → כפתור Icon צ׳אט → כפתור Icon פרופיל עם נקודת התראה.
- **נקודת התראה:** עיגול 11px, `state.notificationDot` #FF3B30, `border: 2px solid app(#181A23)`, ממוקמת top-right של אייקון הפרופיל.
- **רקע:** `app` #181A23 (זהה לרקע, ללא הפרדה). בגלילה ניתן להוסיף `border-bottom: border.default`.

**States** — לכפתורים חלים states של Button. ה-Header עצמו ללא hover/disabled.

---

## 4. Bottom Sheet / Modal

חלונית מודאלית עולה מלמטה (העדפה על־פני Dialog במובייל).

- **רקע גיליון:** `surface` #252836. **רקע מסך מאחור (scrim):** `background.scrim` rgba(0,0,0,0.45).
- **radius:** עליון בלבד `xl` (28px) — `border-radius: 28px 28px 0 0`.
- **shadow:** `sheet` (0 -12px 40px rgba(0,0,0,0.45)).
- **Grabber:** פס 36×4px, `border.strong` #343847, ממורכז, מרווח עליון 12px.
- **padding תוכן:** `22px`, gap בין שורות `16px`.
- **כותרת:** h2 (19px/800) מיושר ימין; כפתור סגירה Icon 44px בפינה שמאל.
- **כפתור פעולה תחתון:** Primary/Accent ברוחב מלא (`width:100%`).
- **גובה מקס׳:** 90vh, תוכן גליל פנימי.

**States**
- `default` — פתוח.
- פתיחה/סגירה — slide-in מלמטה, `motion.slow` (320ms) `easing`. ה-scrim ב-fade.
- `loading` — תוכן מוחלף ב-Skeleton; כפתור הפעולה במצב loading.
- **Modal מרכזי** (לחלופין): אותו רקע, `radius: lg`, ממורכז, רוחב מקס׳ 340px, shadow `lg`.

---

## 5. Input (שדה קלט)

- **רקע:** `surfaceAlt` #2F3344. **טקסט:** primary #FFFFFF. **Placeholder:** `text.tertiary` #7C808E.
- **גובה:** 52px. **padding:** `0 16px`. **radius:** `sm` (16px).
- **גבול:** `1px solid border.default` #262936. **יישור:** RTL, טקסט וקרסור מימין.
- **Label:** מעל השדה, label token (13px/600) #9CA0AE, מרווח 6px.
- **אייקון מוביל (אופציונלי):** 20px בצד ימin, gap 10px.

**States**
- `default` — כמתואר.
- `hover` — גבול `border.strong` #343847.
- `focus` — גבול `2px solid border.focus` #FF2E9A, ללא outline ברירת מחדל.
- `filled` — זהה ל-default עם טקסט primary.
- `error` — גבול `state.error` #FF453A + טקסט עזרה תחתון בצבע error (caption).
- `disabled` — רקע surface, טקסט `text.disabled`, opacity 0.6.
- `loading` — ספינר 18px בקצה המוביל.

---

## 6. Navigation (Bottom Nav)

ניווט תחתון קבוע, 4 פריטים: **בית · הטבות · עדכונים · פרופיל**.

- **רקע:** `navBar` #1B1D27. **גבול עליון:** `1px solid border.default` #262936.
- **padding:** `12px 40px 26px` (התחתון = safe-area). **גובה אפקטיבי:** ~84px.
- **פריט:** אייקון 24px + תווית micro (11px). יישור מאונך, gap 5px.
- **פעיל:** אייקון `brand.primary` #FF2E9A (ממולא), תווית #FF2E9A weight 700.
- **לא פעיל:** אייקון+תווית `text.tertiary` #7C808E weight 600.
- **Home indicator:** פס 130×5px `brand.primary`, ממורכז, 9px מהתחתית.

**States**
- `default` (לא פעיל) / `active` (פעיל) כמתואר.
- `hover` (דסקטופ) — תווית #FFFFFF.
- `disabled` — opacity 0.4.

---

## 7. Section Title (כותרת אזור)

- **מבנה (RTL):** כותרת בצד ימין (h2 — 19px/800 #FFFFFF), קישור פעולה בצד שמאל ("הכל" — label 13px/700 `text.link` #FF2E9A).
- **padding:** `16px 22px 0`. מרווח לתוכן שמתחת: 12px.

**States** — הקישור: hover → underline / opacity 0.8; ללא disabled.

---

## 8. Empty State (מצב ריק)

- **מיקום:** ממורכז בתוך האזור/הכרטיס.
- **מבנה:** אייקון/איור 64px (`text.tertiary` או צבעוני) → כותרת title (17px/700 #FFFFFF) → תיאור body (15px/500 #9CA0AE) → כפתור Primary אופציונלי.
- **מרווחים:** gap 12px בין אלמנטים, padding אנכי 40px.
- **טקסט לדוגמה:** "אין כאן עדיין כלום" / "כשתהיה פעילות חדשה — היא תופיע כאן".

**States** — סטטי. כפתור (אם קיים) עם states של Button.

---

## 9. Loading State

שתי צורות:

**א. Skeleton (מועדף לטעינת תוכן)**
- בלוקים בצורת הקומפוננטה הסופית, רקע `surface` #252836.
- Shimmer: gradient נע `surface → surfaceAlt → surface`, משך 1.2s אינסופי.
- radius זהה לקומפוננטה היעד (md=20px לכרטיסים).

**ב. Spinner (לפעולות נקודתיות)**
- קוטר 18–24px, stroke 2px, צבע `brand.primary` (על כהה) או `onAccent` (בתוך כפתור ליים).
- סיבוב רציף 800ms ליניארי.

**שימוש:** Skeleton לפיד/כרטיסים בעת טעינה ראשונית; Spinner בתוך כפתורים, Inputs, ו-pull-to-refresh.

---

## נספח — מיפוי אייקונים (stroke 2px, currentColor)
| אייקון | קומפוננטה | גודל |
|---|---|---|
| search | כפתור חיפוש | 17px |
| chat (message) | Header | 20px |
| user | Header / Nav פרופיל | 20–24px |
| chevron-down | Header (בורר) | 16px |
| plus | Quick action "כל הפעולות" | 20px |
| lightbulb | Quick action "יש לי רעיון" | 19px |
| clipboard | Quick action "מידע חשוב" | 18px |
| phone | Quick action "יצירת קשר" | 18px |
| calendar | כרטיס אירוע | 20px |
| megaphone | כרטיס עדכון | 20px |
| home (filled) | Nav בית | 24px |
| gift | Nav הטבות | 24px |
| bell | Nav עדכונים | 24px |
