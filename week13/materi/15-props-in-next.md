# Props in Next.js

## Tujuan Pembelajaran
- Memahami konsep props pada komponen Next.js.
- Menyampaikan data dari parent ke child di Server maupun Client Component.
- Menggunakan props untuk membuat komponen fleksibel dan reusable.

## Props di Server Component
Server component menerima props dari parent atau dari data fetching di server.
```jsx
// app/page.jsx
import CourseList from './CourseList';

export default async function Home() {
  const courses = await getCourses(); // fetch di server
  return <CourseList items={courses} />;
}
```
`app/CourseList.jsx`
```jsx
export default function CourseList({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((course) => (
        <li key={course.id} className="border p-3 rounded">
          <h3 className="font-semibold">{course.title}</h3>
          <p className="text-sm text-slate-500">{course.level}</p>
        </li>
      ))}
    </ul>
  );
}
```

## Props di Client Component
Client component menerima props seperti React biasa.
```jsx
'use client';

export default function Toggle({ label, defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={on}
        onChange={(event) => setOn(event.target.checked)}
      />
      {label}: {on ? 'ON' : 'OFF'}
    </label>
  );
}
```

## Passing Children
Gunakan `children` untuk membungkus konten fleksibel.
```jsx
export default function Card({ title, children }) {
  return (
    <div className="rounded border p-4 space-y-2">
      <h2 className="font-semibold text-lg">{title}</h2>
      <div>{children}</div>
    </div>
  );
}
```

## Praktik yang Disarankan
- Definisikan props yang jelas dengan default value.
- Validasi bentuk data (gunakan TypeScript atau PropTypes di client).
- Hindari props drilling dalam, gunakan Context/State manajemen jika perlu.

## Latihan Mandiri
- Buat komponen `StatsCard` yang menerima props `value`, `label`, dan `icon` (React element).
- Kombinasikan beberapa `StatsCard` untuk membuat dashboard ringkas.

## Rangkuman Singkat
- Props mengalir dari parent ke child dan membuat komponen fleksibel.
- Server dan client component sama-sama bisa menerima props.
- Gunakan `children` dan default value untuk meningkatkan reusability.
