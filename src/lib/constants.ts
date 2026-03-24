import type { FieldOverlay } from "@/types";

// Original image dimensions: 932 × 653 px
// Positions measured as percentage of image width/height
export const CERT_W = 932;
export const CERT_H = 653;

export const FIELD_OVERLAYS: FieldOverlay[] = [
  {
    key: "name",
    top: 49.5,
    left: 52.3,
    right: 4,
    color: "#222222",
    fontWeight: "700",
    fontSize: 1.9,
  },
  {
    key: "addr",
    top: 54,
    left: 50.4,
    right: 4,
    color: "#222222",
    fontWeight: "700",
    fontSize: 1.8,
  },
  {
    key: "amount",
    top: 58.2,
    left: 50.5,
    right: 4,
    color: "#222222",
    fontWeight: "700",
    fontSize: 1.8,
  },
  {
    key: "words",
    top: 62.5,
    left: 52.3,
    right: 4,
    color: "#222222",
    fontWeight: "700",
    fontSize: 1.75,
  },
  {
    key: "day",
    top: 70.2,
    left: 69.3,
    right: 4,
    color: "#222222",
    fontWeight: "400",
    fontSize: 1.55,
    fontStyle: "italic",
  },
  {
    key: "month",
    top: 70.2,
    left: 75.6,
    right: 4,
    color: "#222222",
    fontWeight: "400",
    fontSize: 1.55,
    fontStyle: "italic",
  },
  {
    key: "year",
    top: 70.2,
    left: 82.5,
    right: 4,
    color: "#222222",
    fontWeight: "400",
    fontSize: 1.55,
    fontStyle: "italic",
  },
];

export const THEME = {
  gold: "#c8922a",
  red: "#cc2222",
  dark: "#1a0a00",
  border: "#e8c87a",
  panelBg: "#fff9ee",
  appBg: "#f5ede0",
} as const;
