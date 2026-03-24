export interface CertFormData {
  name: string;
  addr: string;
  amount: string;
  words: string;
}

export interface CertDisplayData extends CertFormData {
  date: string;
}

export interface DonationRecord {
  id?: number;
  name: string;
  addr: string;
  amount: string;
  words: string;
  created: number;
}

export interface FieldOverlay {
  key: keyof CertDisplayData;
  top: number;    // percentage of cert height
  left: number;   // percentage of cert width
  right: number;  // right padding %
  color: string;
  fontWeight: string;
  fontSize: number; // in cqw units
  fontStyle?: string;
  label?: string;
}
