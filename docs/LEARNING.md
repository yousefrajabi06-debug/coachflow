# Learn by rebuilding: CoachFlow

This project was built with AI assistance. Use these exercises to turn the implementation into skills you can explain and reproduce.

## How it works

1. `src/main.jsx` mounts the React application.
2. `src/App.jsx` owns the screen state and passes data and callbacks to smaller components.
3. `src/hooks/useLocalStorage.js` reads validated saved data and writes new state after changes. Storage failures show a visible warning.
4. Components render values as text. Forms use labels and native validation. Destructive record actions have a confirmation dialog.
5. `tests/app.spec.js` exercises behavior in a real browser, including persistence and failure cases.

## Concepts to study

Component composition, form validation, CRUD operations, selected-record state, computed summaries, and localStorage.

## Rebuild it yourself

- Recreate one card component from an empty file without copying it.
- Explain why updating an array uses `map`, `filter`, or a new array rather than mutating the old state.
- Build one form with a controlled input and reject whitespace-only values.
- Add one feature from the README's future improvements and write a behavior test for it.
- Disable localStorage in a test and explain why the app can still work for the current session.

## Interview walkthrough

Describe the problem, demonstrate a complete user flow, then explain one failure case. Be candid that this version was built with AI assistance. Show the changes you later implemented yourself through ordinary commits.

## بالعربية

- ابدأ من `App.jsx`: حدّد البيانات التي تتغيّر، ثم تتبّع انتقالها للمكوّنات عبر props.
- أعد بناء نموذج واحد وبطاقة واحدة بنفسك. لا تكتفِ بقراءة الكود.
- جرّب الإضافة والتعديل ثم تحديث الصفحة لفهم دور localStorage.
- اشرح الفرق بين البيانات الأصلية والنتائج المحسوبة مثل البحث والإحصاءات.
- أضف تحسينًا صغيرًا بيدك ووثّقه في commit؛ هذا يجعل المشروع شاهدًا على تعلّمك الحقيقي.
