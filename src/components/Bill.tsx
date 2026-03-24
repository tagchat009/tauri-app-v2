import type { CertDisplayData } from "@/types";
import { formatMoney } from "@/lib/viet-number";

interface BillProps {
  data: CertDisplayData;
}

export function Bill({ data }: BillProps) {
  return (
    <div
      id="bill-root"
      style={{
        width: "100%",
        maxWidth: "600px",
        padding: "40px",
        background: "white",
        color: "#000",
        fontFamily: "'Times New Roman', serif",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "32px", borderBottom: "2px solid #333", paddingBottom: "16px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 8px 0" }}>
          PHIẾU THU CÔNG ĐỨC
        </h1>
        <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
          Tộc Đàm Thân – Ghi Nhận Công Đức
        </p>
      </div>

      {/* Content */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontWeight: "bold" }}>Họ Tên:</span>
          <span>{data.name}</span>
        </div>
        <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontWeight: "bold" }}>Địa Chỉ:</span>
          <span style={{ textAlign: "right" }}>{data.addr}</span>
        </div>
        <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontWeight: "bold" }}>Số Tiền:</span>
          <span>{data.amount ? formatMoney(data.amount) : ""} ₫</span>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontWeight: "bold", marginBottom: "4px" }}>Bằng Chữ:</div>
          <div style={{ paddingLeft: "20px" }}>{data.words}</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: "40px", borderTop: "2px solid #333", paddingTop: "16px" }}>
        <p style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
          Ngày {data.day} tháng {data.month} năm {data.year}
        </p>
        <p style={{ margin: "16px 0 0 0", fontSize: "12px", color: "#666", fontStyle: "italic" }}>
          Cảm ơn quý công đức nhân
        </p>
      </div>
    </div>
  );
}
