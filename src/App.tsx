import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { CertForm } from "@/components/CertForm";
import { Certificate } from "@/components/Certificate";
import { Bill } from "@/components/Bill";
import { HistoryPanel } from "@/components/HistoryPanel";
import { useHistory } from "@/hooks/useHistory";
import { numberToWords, todayVN } from "@/lib/viet-number";
import type { CertFormData, CertDisplayData, DonationRecord } from "@/types";
const EMPTY_FORM: CertFormData = { name: "", addr: "", amount: "", words: "" };
const EMPTY_CERT: CertDisplayData = { ...EMPTY_FORM, date: "" };

export default function App() {
  const [form, setForm] = useState<CertFormData>(EMPTY_FORM);
  const [cert, setCert] = useState<CertDisplayData>(EMPTY_CERT);
  const [saved, setSaved] = useState(false);

  const certRef = useRef<HTMLDivElement>(null);
  const billRef = useRef<HTMLDivElement>(null);

  const { history, loading, loadHistory, saveRecord, removeRecord, clearHistory } = useHistory();
  const bgUrl = "./background.jpg";

  useEffect(() => { loadHistory(); }, [loadHistory]);

  const handleChange = (field: keyof CertFormData, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "amount") next.words = numberToWords(value);
      return next;
    });
  };

  const fillDisplay = () => {
    const newCert: CertDisplayData = { ...form, date: todayVN() };
    setCert(newCert);
    return newCert;
  };

  const fill = async () => {
    fillDisplay();
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

  const printCert = useReactToPrint({
    contentRef: certRef,
    documentTitle: "Phiếu Công Đức",
    pageStyle: `
      @page { margin: 0; size: auto; }
      @media print { body { margin: 0; padding: 0; } }
    `,
    onAfterPrint: () => {
      const bg = document.getElementById("cert-bg");
      if (bg) bg.style.visibility = "visible";
    },
  });

  const printBill = useReactToPrint({
    contentRef: billRef,
    documentTitle: "Phiếu Thu",
    pageStyle: `
      @page { margin: 0; size: auto; }
      @media print { body { margin: 0; padding: 0; } }
    `,
    onAfterPrint: () => {
      if (billRef.current) {
        billRef.current.style.position = "absolute";
        billRef.current.style.left = "-9999px";
      }
    },
  });

  const handlePrint = () => {
    fillDisplay();

    // Hide background before print
    const bg = document.getElementById("cert-bg");
    if (bg) bg.style.visibility = "hidden";

   setTimeout(() => printCert(), 100);
  };

  const handlePrintBill = () => {
    fillDisplay();

    // Move bill into view before printing
    if (billRef.current) {
      billRef.current.style.position = "static";
      billRef.current.style.left = "0";
    }

    setTimeout(() => printBill(), 100);
  };

  const clearForm = () => {
    setForm(EMPTY_FORM);
    setCert(EMPTY_CERT);
  };

  const loadRec = (rec: DonationRecord) => {
    const f: CertFormData = { name: rec.name, addr: rec.addr, amount: rec.amount, words: rec.words };
    setForm(f);
    setCert({ ...f, date: todayVN() });
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

      <span className="preview-label no-print">Xem trước phiếu công đức</span>

      {/* Certificate — ref attached here for printing */}

      <div ref={certRef} style={{ width: "100%", maxWidth: 800, margin: "0 auto" }}>
        <Certificate data={cert} bgUrl={bgUrl} />
      </div>

      {/* Bill — always rendered but visually hidden; ref for printing */}
      <div ref={billRef} style={{ position: "absolute", left: "-9999px", top: 0 }}>
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