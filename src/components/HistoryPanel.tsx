import type { DonationRecord } from "@/types";
import { formatMoney } from "@/lib/viet-number";

interface HistoryPanelProps {
  history: DonationRecord[];
  loading: boolean;
  onLoad: (rec: DonationRecord) => void;
  onDelete: (id: number) => void;
  onClearAll: () => void;
}

function exportToCSV(records: DonationRecord[]) {
  if (records.length === 0) return;

  const headers = ["ID", "Tên", "Địa chỉ", "Số tiền", "Bằng chữ", "Ngày tạo"];
  const csvContent = [
    headers.join(","),
    ...records.map((rec) => [
      rec.id || "",
      `"${rec.name}"`,
      `"${rec.addr}"`,
      rec.amount,
      `"${rec.words}"`,
      new Date(rec.created).toLocaleDateString("vi-VN")
    ].join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `lich-su-dong-gop-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function HistoryPanel({
  history,
  loading,
  onLoad,
  onDelete,
}: HistoryPanelProps) {
  return (
    <div className="panel no-print" style={{ animationDelay: ".12s" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
          paddingBottom: 10,
        }}
      >
        <h2 className="panel-title">📜 Lịch Sử Đóng Góp</h2>
        <div style={{ display: "flex", gap: "8px" }}>
          {history.length > 0 && (
            <button className="link-btn" onClick={() => exportToCSV(history)}>
              📊 Xuất CSV
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="empty-msg">Đang tải...</div>
      ) : history.length === 0 ? (
        <div className="empty-msg">Chưa có dữ liệu</div>
      ) : (
        <div className="history-list">
          {history.map((rec) => {
            const d = new Date(rec.created);
            const dateStr = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
            return (
              <div
                key={rec.id}
                className="history-item"
                onClick={() => onLoad(rec)}
              >
                <span className="hi-name">{rec.name}</span>
                <span className="hi-date">{dateStr}</span>
                <span className="hi-amount">
                  {rec.amount ? formatMoney(rec.amount) : "—"}
                </span>
                <button
                  className="hi-del"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (rec.id !== undefined) onDelete(rec.id);
                  }}
                >
                  🗑
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
