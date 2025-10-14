# State Management Overview

## Apa Itu State Management?
State = data yang menentukan tampilan UI. State management = cara mengubah dan membagikan data tersebut secara konsisten.

Kategori umum:
- **Local state** – `useState`, `useReducer` di komponen tertentu.
- **Global state** – dibagikan ke banyak komponen (Context, Redux, Zustand, Recoil).
- **Server state** – data dari API yang perlu sinkronisasi (React Query, SWR, custom fetcher).

## Tanda Butuh State Management
- Banyak komponen saudara memerlukan data yang sama.
- Butuh caching/persistensi antar halaman.
- Terdapat alur kompleks (wizard, multi-step) dengan banyak update.

## Kerangka Evaluasi
| Pertanyaan | Jika "Ya" → |
| --- | --- |
| Data hanya dipakai di 1-2 komponen? | `useState` lokal cukup |
| Update sering dan perlu memoization? | Pertimbangkan `useReducer` |
| Banyak komponen berbeda memerlukan data? | Context/Global store |
| Data berasal dari API & perlu caching? | SWR/React Query/custom hook |

## Practice Prompt
> Berikan contoh feature, minta student memilah mana yang cukup `useState`, mana yang perlu Context/global store.

## Ringkasan
Tidak semua masalah butuh global state. Tentukan berdasarkan scope pemakaian, frekuensi update, dan kebutuhan sinkronisasi. EOF
