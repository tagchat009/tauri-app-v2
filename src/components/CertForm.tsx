import type { CertFormData } from "@/types";
import { THEME } from "@/lib/constants";

interface CertFormProps {
  form: CertFormData;
  saved: boolean;
  bgUrl: string | null;
  onChange: (field: keyof CertFormData, value: string) => void;
  onFill: () => void;
  onPrint: () => void;
  onPrintBill: () => void;
  onClear: () => void;
}

export function CertForm({
  form,
  saved,
  bgUrl,
  onChange,
  onFill,
  onPrint,
  onPrintBill,
  onClear,
}: CertFormProps) {

  return (
    <div className="panel no-print" style={{ animationDelay: ".06s" }}>
      <h2 className="panel-title" style={{ marginBottom: 16 }}>
        📋 Nhập Thông Tin
      </h2>

      {(
        [
          ["name", "Họ và Tên", "Đàm Văn A", "text", "white"],
          ["addr", "Địa Chỉ", "123 Lê Lợi, Đà Nẵng", "text", "white"],
        ] as [keyof CertFormData, string, string, string, string][]
      ).map(([id, label, ph, , bg]) => (
        <div key={id} className="field-group">
          <label className="field-label">{label}</label>
          <input
            className="field-input"
            value={form[id]}
            placeholder={ph}
            style={{ background: bg }}
            onChange={(e) => onChange(id, e.target.value)}
          />
        </div>
      ))}

      <div className="field-group">
        <label className="field-label">Số Tiền (VNĐ)</label>
        <input
          className="field-input"
          value={form.amount}
          placeholder="500000"
          onChange={(e) => onChange("amount", e.target.value)}
        />
      </div>

      <div className="field-group">
        <label className="field-label" style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Bằng Chữ</span>
          {form.words && (
            <span style={{ color: THEME.gold, fontStyle: "italic", textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>
              ✓ tự động
            </span>
          )}
        </label>
        <input
          className="field-input"
          value={form.words}
          placeholder="Năm trăm nghìn đồng"
          style={{ background: "#fffbf0" }}
          onChange={(e) => onChange("words", e.target.value)}
        />
      </div>

      {/* Background picker */}
      {!bgUrl && (<div
        style={{
          marginTop: 14,
          padding: "10px 14px",
          background: bgUrl ? "#f0fff4" : "#fff8f0",
          border: `1px dashed ${bgUrl ? "#4caf50" : THEME.border}`,
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <span style={{ fontSize: "0.78rem", color: "#999" }}>
          {"📎 Chưa có hình nền"}
        </span>
      </div>)}

      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <button className="btn btn-gold" onClick={onFill}>
          {saved ? "✅ Đã lưu!" : "✏️ Lưu"}
        </button>
        <button className="btn btn-red" onClick={onPrint}>
          🖨️ In Phiếu
        </button>
        <button className="btn btn-blue" onClick={onPrintBill}>
          📄 In Bill
        </button>
        <button className="btn btn-clear" onClick={onClear}>
          ✕
        </button>
      </div>
    </div>
  );
}
