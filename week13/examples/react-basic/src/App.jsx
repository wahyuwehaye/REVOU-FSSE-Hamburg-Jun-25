import { useState } from 'react';
import Hero from './components/Hero.jsx';
import FeatureList from './components/FeatureList.jsx';

const initialFeatures = [
  { id: 'state', title: 'Stateful UI', description: 'Kelola interaksi menggunakan useState dan hooks lain.' },
  { id: 'component', title: 'Component-Based', description: 'Pecah UI menjadi bagian kecil yang mudah dirawat.' },
  { id: 'props', title: 'Props Flow', description: 'Oper data antar komponen dengan bahasa deklaratif.' },
];

export default function App() {
  const [features, setFeatures] = useState(initialFeatures);

  function addFeature() {
    const next = {
      id: crypto.randomUUID(),
      title: 'Custom Feature',
      description: 'Tambahkan fitur baru secara dinamis untuk latihan.',
    };
    setFeatures((prev) => [next, ...prev]);
  }

  return (
    <div className="app">
      <Hero onAddFeature={addFeature} />
      <FeatureList items={features} />
    </div>
  );
}
