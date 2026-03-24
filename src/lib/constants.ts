import type { FieldOverlay } from "@/types";

// Original image dimensions: 932 × 653 px
// Positions measured as percentage of image width/height
export const CERT_W = 932;
export const CERT_H = 653;

export const FIELD_OVERLAYS: FieldOverlay[] = [
  {
    key: "name",
    top: 50,
    left: 54,
    right: 4,
    color: "#222222",
    fontWeight: "700",
    fontSize: 1.9,
    label: "Họ và tên",
  },
  {
    key: "addr",
    top: 54,
    left: 54,
    right: 4,
    color: "#222222",
    fontWeight: "700",
    fontSize: 1.8,
    label: "Địa chỉ",
  },
  {
    key: "amount",
    top: 58,
    left: 54,
    right: 4,
    color: "#222222",
    fontWeight: "700",
    fontSize: 1.8,
    label: "Số tiền",
  },
  {
    key: "words",
    top: 62,
    left: 54,
    right: 4,
    color: "#222222",
    fontWeight: "700",
    fontSize: 1.75,
    label: "Bằng chữ",
  },
  {
    key: "date",
    top: 70,
    left: 60,
    right: 4,
    color: "#222222",
    fontWeight: "400",
    fontSize: 1.55,
    fontStyle: "italic",
  }
];

export const THEME = {
  gold: "#c8922a",
  red: "#cc2222",
  dark: "#1a0a00",
  border: "#e8c87a",
  panelBg: "#fff9ee",
  appBg: "#f5ede0",
} as const;
