import { ContactForm } from './contact/ContactForm';
import { MessageList } from './components/MessageList';

async function fetchMessages() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/contacts`, { cache: 'no-store' });
  if (!res.ok) {
    return [];
  }
  return (await res.json()) as Parameters<typeof MessageList>[0]['items'];
}

export default async function FormsDemoPage() {
  const messages = await fetchMessages();

  return (
    <main style={{ display: 'grid', gap: '2.5rem' }}>
      <section>
        <h2>Kirim Pesan</h2>
        <p style={{ color: '#475569' }}>Contoh form type-safe menggunakan React Hook Form + Zod + API route.</p>
        <ContactForm />
      </section>
      <section>
        <h2>Pesan Masuk</h2>
        <MessageList items={messages} />
      </section>
    </main>
  );
}
