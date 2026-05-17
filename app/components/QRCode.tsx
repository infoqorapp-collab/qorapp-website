'use client';
import { useRef } from 'react';
import QRCodeCanvas from 'qrcode.react';
import { Download, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface QRCodeComponentProps {
  value: string;
  size?: number;
  label?: string;
  businessName?: string;
}

export default function QRCodeComponent({ 
  value, 
  size = 250, 
  label = 'Scan to send money',
  businessName = 'QORAPP User'
}: QRCodeComponentProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `qrcode-${businessName.replace(/\s+/g, '-')}.png`;
      link.click();
    }
  };

  const copyQRLink = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col items-center text-center"
    >
      <h3 className="text-2xl font-bold text-pesa-navy mb-2">Payment QR Code</h3>
      <p className="text-gray-600 mb-6">{label}</p>

      {/* QR Code Container */}
      <div
        ref={qrRef}
        className="mb-6 p-4 bg-white border-2 border-gray-200 rounded-2xl"
      >
        <QRCodeCanvas
          value={value}
          size={size}
          level="H"
          includeMargin={true}
          fgColor="#001a4d"
          bgColor="#ffffff"
        />
      </div>

      {/* Business Name */}
      <p className="text-lg font-semibold text-pesa-navy mb-6">{businessName}</p>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 w-full text-left text-sm">
        <p className="text-blue-900 font-semibold mb-2">How it works:</p>
        <ul className="text-blue-800 space-y-1 text-xs">
          <li>✓ Others scan this QR code with their camera</li>
          <li>✓ They're directed to your payment page</li>
          <li>✓ They can enter the amount and send money</li>
          <li>✓ You receive it instantly</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={downloadQR}
          className="flex-1 flex items-center justify-center gap-2 bg-pesa-navy text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition"
        >
          <Download size={20} />
          Download QR
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={copyQRLink}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-pesa-navy font-bold py-3 rounded-xl hover:bg-slate-200 transition"
        >
          {copied ? (
            <>
              <Check size={20} className="text-green-600" />
              Copied!
            </>
          ) : (
            <>
              <Copy size={20} />
              Copy Link
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
