import type { CertDisplayData } from "@/types";
import { FIELD_OVERLAYS, CERT_W, CERT_H } from "@/lib/constants";
import { formatMoney } from "@/lib/viet-number";

interface CertificateProps {
  data: CertDisplayData;
  bgUrl: string;
}

export function Certificate({ data, bgUrl }: CertificateProps) {
  const values: Record<string, string> = {
    name:   data.name,
    addr:   data.addr,
    amount: data.amount ? formatMoney(data.amount) : "",
    words:  data.words,
    day:   data.day,
    month:  data.month,
    year:   data.year,
  };

  return (
    <div
      id="cert-root"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: CERT_W,
        aspectRatio: `${CERT_W} / ${CERT_H}`,
        overflow: "hidden",
        boxShadow: "0 8px 40px rgba(0,0,0,.28)",
        containerType: "inline-size",
      }}
    >
      <img
        src={bgUrl}
        alt="Phiếu công đức"
        style={{ width: "100%", height: "100%", display: "block", objectFit: "fill" }}
        draggable={false}
      />

      {FIELD_OVERLAYS.map((f) => (
        <div
          key={f.key}
          style={{
            position: "absolute",
            top: `${f.top}%`,
            left: `${f.left}%`,
            right: `${f.right}%`,
            color: f.color,
            fontFamily: "'Times New Roman', 'Noto Serif', serif",
            fontWeight: f.fontWeight,
            fontStyle: f.fontStyle ?? "normal",
            fontSize: `${f.fontSize}cqw`,
            lineHeight: 1.25,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            pointerEvents: "none",
          }}
        >
          {values[f.key]}
        </div>
      ))}
    </div>
  );
}
