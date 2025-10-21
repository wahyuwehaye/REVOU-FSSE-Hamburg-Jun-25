import { useEffect, useState } from "react";
import { fetchUsers } from "@/lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
}

export function useUsers() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    fetchUsers()
      .then((users) => {
        if (mounted) {
          setData(users);
        }
      })
      .catch(() => {
        if (mounted) {
          setError("Tidak bisa memuat data pengguna");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
}
