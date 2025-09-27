export default async function ServerClock() {
  const now = new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'medium' });
  await new Promise((resolve) => setTimeout(resolve, 150));
  return (
    <p style={{ color: '#475569' }}>
      Rendered di server pada <strong>{now}</strong>
    </p>
  );
}
