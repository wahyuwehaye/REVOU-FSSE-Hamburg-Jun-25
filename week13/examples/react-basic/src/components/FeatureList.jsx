export default function FeatureList({ items }) {
  if (!items.length) {
    return <p>Tidak ada fitur, coba tambahkan!</p>;
  }

  return (
    <section className="feature-list">
      <h2>Kenapa React?</h2>
      <ul>
        {items.map((feature) => (
          <li key={feature.id}>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
