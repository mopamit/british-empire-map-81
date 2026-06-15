# התקנת Empire Bloom ב־GitHub Pages

הפרויקט המקורי הגיע מ־Lovable כ־TanStack Start/SSR, אבל GitHub Pages הוא אחסון סטטי בלבד. לכן בוצעו התאמות כדי שהאתר ירוץ כ־Vite + React סטטי.

## מה שונה בקבצים

- נוסף `index.html` — נקודת כניסה סטטית רגילה.
- נוסף `src/main.tsx` — מרנדר את האפליקציה לדפדפן.
- עודכן `src/router.tsx` — שימוש ב־Hash History כדי שהאתר יעבוד גם תחת `https://USER.github.io/REPO/`.
- עודכן `vite.config.ts` — הוסר הקונפיג של Lovable/TanStack Start והוחלף בקונפיג Vite סטטי.
- נוסף `.github/workflows/deploy.yml` — פריסה אוטומטית ל־GitHub Pages.
- עודכן React ל־18.3.1 כדי למנוע בעיית peer dependency מול `react-simple-maps`.

## העלאה לגיטהאב

1. צור Repository חדש ב־GitHub, למשל: `empire-bloom`.
2. העלה אליו את כל הקבצים שבתיקייה הזאת.
3. ודא שה־branch הראשי נקרא `main`.
4. היכנס ב־GitHub ל־Settings → Pages.
5. תחת Build and deployment בחר Source: `GitHub Actions`.
6. בצע Push ל־main.
7. עבור ללשונית Actions ובדוק שה־workflow בשם `Deploy to GitHub Pages` הסתיים בהצלחה.
8. בסיום תקבל כתובת בסגנון:
   `https://USERNAME.github.io/empire-bloom/`

## בדיקה מקומית במחשב

אם אתה רוצה לבדוק לפני העלאה:

```bash
npm install
npm run dev
```

ואז לפתוח את הכתובת שמופיעה בטרמינל.

אם `npm install` מתלונן על dependencies, להריץ:

```bash
npm install --legacy-peer-deps
```

## הערה חשובה

האתר משתמש בקובץ מפה חיצוני מהאינטרנט:
`https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json`

כלומר האתר יעבוד רק כשהדפדפן מחובר לאינטרנט. אם תרצה שימוש מלא גם בלי אינטרנט, צריך להוריד את קובץ המפה ולהגיש אותו מתוך הפרויקט.
