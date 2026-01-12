declare module "react-qr-scanner" {
  import * as React from "react";

  export interface QrScannerProps {
    onError?: (error: any) => void;
    onScan?: (data: { text: string } | null) => void;
    style?: React.CSSProperties;
    constraints?: MediaStreamConstraints;
    delay?: number;
    facingMode?: "user" | "environment";
    legacyMode?: boolean;
    maxImageSize?: number;
    className?: string;
  }

  export default class QrScanner extends React.Component<QrScannerProps> {}
}
