import TodosClient from "@/components/TodosClient";

export const metadata = { title: "Todos | Demo TS" };

export default async function TodosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  return <TodosClient initialFilter={params?.q} />;
}
