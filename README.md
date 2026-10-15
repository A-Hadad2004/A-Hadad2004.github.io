# הפורטפוליו של עטרה – מדריך

## קבצים
| קובץ | מה הוא עושה |
|---|---|
| `index.html` | כל התוכן (באנגלית) |
| `style.css` | עיצוב וצבעים. הצבע הראשי הוא `--primary` |
| `script.js` | מצב כהה ותפריט בטלפון |

## דברים שאפשר להוסיף בהמשך
- **GitHub**: להוסיף שורה ב-`hero-links` ובאזור `contact-list` ב-`index.html`
- **קורות חיים**: לשמור כ-`cv.pdf` בתיקייה ולהוסיף כפתור:
  `<a href="cv.pdf" class="btn btn-outline" download>Download CV</a>`

## כללי תוכן (מה-brief)
אין טענות על production, אין מספרים מומצאים (רק 98.5%), אין טענות "solo" על OSINT ועל ה-framework, אין em dashes.

## העלאה ל-GitHub Pages
1. ליצור repository ציבורי בשם `USERNAME.github.io`
2. **uploading an existing file** ← לגרור את הקבצים (לא את התיקייה) ← **Commit changes**
3. **Settings ← Pages**: לוודא `Deploy from a branch`, `main`, `/ (root)`
4. אחרי דקה-שתיים: `https://USERNAME.github.io`

## הציורים
הציורים נמצאים בתיקייה `art/` ומופיעים בקולאז' שבפתיחה. כדי להוסיף ציור: לשמור אותו ב-`art/` (למשל `art-14.jpg`), ואז ב-`index.html` להעתיק שורת `<div class="piece">` ולשנות את שם הקובץ, מיקום (`--x`, `--y`), גודל (`--w`) וסיבוב (`--r`).

## הפרויקטים
כל פרויקט הוא כרטיס עם איור (SVG) בתוך `<span class="tile-art">`, והתוכן המלא נמצא ב-`<div class="project-body" hidden>` מתחתיו. בלחיצה על הכרטיס התוכן נפתח בחלון.
כדי לשנות טקסט של פרויקט, עורכים את מה שבתוך `project-body`.
הפרויקטים מוצגים בשורה שגוללים לרוחב. החיצים נוספים אוטומטית מ-`script.js`, ובטלפון גוללים באצבע.
