export default function Home({
  searchParams,
}: {
  searchParams: { highlight?: string };
}) {
  return (
    <section>
      <h1 className="text-2xl font-bold">Selamat datang 👋</h1>
      <p className="text-gray-600">
        {searchParams?.highlight
          ? `Mode highlight: ${searchParams.highlight}`
          : "Gunakan ?highlight=... di URL untuk demo search params."}
      </p>
    </section>
  );
}
