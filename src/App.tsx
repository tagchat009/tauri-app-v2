import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { CertForm } from "@/components/CertForm";
import { Certificate } from "@/components/Certificate";
import { HistoryPanel } from "@/components/HistoryPanel";
import { useHistory } from "@/hooks/useHistory";
import { numberToWords, todayVN } from "@/lib/viet-number";
import type { CertFormData, CertDisplayData, DonationRecord } from "@/types";
// import html2pdf from "html2pdf.js";
// import { openPath } from '@tauri-apps/plugin-opener';

const EMPTY_FORM: CertFormData = { name: "", addr: "", amount: "", words: "" };
const EMPTY_CERT: CertDisplayData = { ...EMPTY_FORM, date: "" };

export default function App() {
  const [form, setForm] = useState<CertFormData>(EMPTY_FORM);
  const [cert, setCert] = useState<CertDisplayData>(EMPTY_CERT);
  const [saved, setSaved] = useState(false);

  const certRef = useRef<HTMLDivElement>(null);

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
    print: async (iframe: HTMLIFrameElement) => {
      // Hide cert-bg inside the iframe clone
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) return;
      const bg = iframeDoc.getElementById("cert-bg");
      if (bg) bg.style.visibility = "hidden";
      console.log("print called", iframe); // 👈 check if this appears
      window.print();
    },
    onAfterPrint: () => {
      const bg = document.getElementById("cert-bg");
      if (bg) bg.style.visibility = "visible";
    },
  });

  const handlePrint = () => {
    fillDisplay();
    printCert();
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
        onClear={clearForm}
      />

      <span className="preview-label no-print">Xem trước phiếu công đức</span>

      {/* Certificate — ref attached here for printing */}

      <div ref={certRef} style={{ width: "100%", maxWidth: 800, margin: "0 auto" }}>
        <Certificate data={cert} bgUrl={bgUrl} />
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