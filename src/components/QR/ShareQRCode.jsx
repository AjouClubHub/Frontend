import React from 'react';
// 이름 붙은(named) export 로 가져옵니다.
// 필요에 따라 Canvas 형식을 쓰거나 SVG 형식을 쓰세요.
import { QRCodeCanvas } from 'qrcode.react';
// 또는: import { QRCodeSVG } from 'qrcode.react';

export default function ShareQRCode() {
  return (
    <div style={{ textAlign: 'center' }}>
      <QRCodeCanvas
        value="https://www.ajouclub.site"
        size={200}
        level="H"
        includeMargin
      />
    </div>
  );
}
