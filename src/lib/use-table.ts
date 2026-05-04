import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useTable<T = any>(table: string, opts?: { order?: { column: string; ascending?: boolean } }) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    let q = (supabase.from(table as any) as any).select("*");
    if (opts?.order) q = q.order(opts.order.column, { ascending: opts.order.ascending ?? false });
    const { data } = await q;
    setRows((data ?? []) as T[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const ch = supabase
      .channel(`rt-${table}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  return { rows, loading, reload: load };
}
