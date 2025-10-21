import { useUsers } from "@/hooks/useUsers";

export function UserDirectory() {
  const { data, loading, error } = useUsers();

  if (loading) {
    return <p>Memuat data pengguna…</p>;
  }

  if (error) {
    return (
      <div role="alert">
        <p>{error}</p>
        <button type="button" onClick={() => window.location.reload()}>
          Coba lagi
        </button>
      </div>
    );
  }

  if (data.length === 0) {
    return <p>Tidak ada pengguna terdaftar.</p>;
  }

  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>
          <strong>{user.name}</strong>
          <span style={{ display: "block", fontSize: "0.85rem" }}>{user.email}</span>
        </li>
      ))}
    </ul>
  );
}
