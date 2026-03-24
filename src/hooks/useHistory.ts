import { useState, useCallback } from "react";
import { addRecord, getAllRecords, deleteRecord, clearAllRecords } from "@/lib/db";
import type { DonationRecord } from "@/types";

export function useHistory() {
  const [history, setHistory] = useState<DonationRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await getAllRecords();
      console.log("Loaded history:", rows);
      setHistory(rows);
    } catch (e) {
      console.error("Failed to load history:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveRecord = useCallback(
    async (data: Omit<DonationRecord, "id" | "created">) => {
      await addRecord({ ...data, created: Date.now() });
      await loadHistory();
    },
    [loadHistory]
  );

  const removeRecord = useCallback(
    async (id: number) => {
      await deleteRecord(id);
      await loadHistory();
    },
    [loadHistory]
  );

  const clearHistory = useCallback(async () => {
    await clearAllRecords();
    setHistory([]);
  }, []);

  return { history, loading, loadHistory, saveRecord, removeRecord, clearHistory };
}
