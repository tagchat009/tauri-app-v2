import { useState, useEffect } from "react";
import { CertForm } from "@/components/CertForm";
import { Certificate } from "@/components/Certificate";
import { Bill } from "@/components/Bill";
import { HistoryPanel } from "@/components/HistoryPanel";
import { useHistory } from "@/hooks/useHistory";
import { numberToWords, todayVN, todayOutput } from "@/lib/viet-number";
import type { CertFormData, CertDisplayData, DonationRecord } from "@/types";

const EMPTY_FORM: CertFormData = { name: "", addr: "", amount: "", words: "" };
const EMPTY_CERT: CertDisplayData = { ...EMPTY_FORM, date: "", day: "", month: "", year: "" };

export default function App() {
  const [form, setForm] = useState<CertFormData>(EMPTY_FORM);
  const [cert, setCert] = useState<CertDisplayData>(EMPTY_CERT);
  const [saved, setSaved] = useState(false);

  const { history, loading, loadHistory, saveRecord, removeRecord, clearHistory } = useHistory();
  const bgUrl = "./src/assets/background.jpg";
  const { day, month, year } = todayOutput();

  useEffect(() => { loadHistory(); }, [loadHistory]);

  const handleChange = (field: keyof CertFormData, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Auto-convert amount → words
      if (field === "amount") next.words = numberToWords(value);
      return next;
    });
  };

  const fill = async () => {
    const newCert: CertDisplayData = { ...form, day, month, year, date: todayVN() };
    setCert(newCert);
    if (form.name.trim()) {
      try {
        await saveRecord({ name: form.name, addr: form.addr, amount: form.amount, words: form.words });
        setSaved(true);
        setTimeout(() => setSaved(false), 2200);
      } catch (e) {
        console.error("Failed to save:", e);
      }
    }
  };

  const handlePrint = () => {
    fill().then(() => setTimeout(() => window.print(), 200));
  };

  const handlePrintBill = () => {
    fill().then(() => {
      setTimeout(() => {
        const billElement = document.getElementById("bill-root");
        if (billElement) {
          const printWindow = window.open("", "_blank");
          if (printWindow) {
            printWindow.document.write(`
              <!DOCTYPE html>
              <html>
              <head>
                <title>Phiếu Thu</title>
                <style>
                  @media print {
                    body { margin: 0; padding: 0; }
                    body * { margin: 0; padding: 0; box-sizing: border-box; }
                  }
                </style>
              </head>
              <body>
                ${billElement.outerHTML}
                <script>
                  window.print();
                  window.close();
                </script>
              </body>
              </html>
            `);
            printWindow.document.close();
          }
        }
      }, 200);
    });
  };

  const clearForm = () => {
    setForm(EMPTY_FORM);
    setCert(EMPTY_CERT);
  };

  const loadRec = (rec: DonationRecord) => {
    const f: CertFormData = { name: rec.name, addr: rec.addr, amount: rec.amount, words: rec.words };
    setForm(f);
    setCert({ ...f, day, month, year, date: todayVN() });
  };

  return (
    <div className="app-shell">
      <h1 className="app-title no-print">
        ⚜ Tộc Đàm Thân – Ghi Nhận Công Đức ⚜
      </h1>

      <CertForm
        form={form}
        saved={saved}
        bgUrl={bgUrl}
        onChange={handleChange}
        onFill={fill}
        onPrint={handlePrint}
        onPrintBill={handlePrintBill}
        onClear={clearForm}
      />

      {/* Certificate preview */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          width: "100%",
          maxWidth: 932,
        }}
      />
      <span className="preview-label no-print">Xem trước phiếu công đức</span>

      <Certificate data={cert} bgUrl={bgUrl} />

      {/* Bill preview (hidden, used for bill printing) */}
      <div style={{ display: "none" }}>
        <Bill data={cert} />
      </div>

      <HistoryPanel
        history={history}
        loading={loading}
        onLoad={loadRec}
        onDelete={removeRecord}
        onClearAll={clearHistory}
      />
    </div>
  );
}
