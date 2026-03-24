const UNITS = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"] as const;

function readGroup(n: number, isFirst: boolean): string {
  if (n === 0) return "";
  const h = Math.floor(n / 100);
  const t = Math.floor((n % 100) / 10);
  const u = n % 10;
  let s = "";

  if (h) s += UNITS[h] + " trăm";
  else if (!isFirst && (t || u)) s += "không trăm";

  if (t === 1) {
    s += " mười";
    if (u === 5) s += " lăm";
    else if (u) s += " " + UNITS[u];
  } else if (t > 1) {
    s += " " + UNITS[t] + " mươi";
    if (u === 1) s += " mốt";
    else if (u === 5) s += " lăm";
    else if (u) s += " " + UNITS[u];
  } else if (u) {
    if (h || !isFirst) s += " lẻ";
    s += " " + (u === 5 && !isFirst ? "lăm" : UNITS[u]);
  }

  return s.trim();
}

export function numberToWords(raw: string): string {
  const n = parseInt(raw.replace(/\D/g, ""), 10);
  if (!n || isNaN(n)) return "";

  const B = Math.floor(n / 1e9);
  const M = Math.floor((n % 1e9) / 1e6);
  const K = Math.floor((n % 1e6) / 1e3);
  const R = n % 1e3;

  const parts: string[] = [];
  if (B) parts.push(readGroup(B, true) + " tỷ");
  if (M) parts.push(readGroup(M, !B) + " triệu");
  if (K) parts.push(readGroup(K, !B && !M) + " nghìn");
  if (R) parts.push(readGroup(R, !B && !M && !K));

  const result = parts.join(" ").replace(/\s+/g, " ").trim();
  return result.charAt(0).toUpperCase() + result.slice(1) + " đồng";
}

export function formatMoney(raw: string): string {
  const n = parseInt(raw.replace(/\D/g, ""), 10);
  if (!n || isNaN(n)) return "";
  return n.toLocaleString("vi-VN") + " đồng";
}

export function todayVN(): string {
  const d = new Date();
  return `Ngày ${d.getDate()} tháng ${d.getMonth() + 1} năm ${d.getFullYear()}`;
}

export function todayOutput(): { day: string; month: string; year: string } {
  const d = new Date();
  return {
    day: d.getDate().toString(),
    month: (d.getMonth() + 1).toString(),
    year: d.getFullYear().toString().slice(-1),
  };
}