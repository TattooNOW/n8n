import React, { useEffect, useState } from 'react';

/**
 * QRCode - Dynamic QR code display
 * Supports both in-browser generation and HighLevel API
 * Can be toggled on/off via Stream Deck or keyboard
 */
export function QRCode({
  url,
  message,
  highlevelUrl = null, // If provided, use HighLevel QR code instead of generating
  display = true,
  position = 'bottom-right', // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
  size = 200
}) {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);

  useEffect(() => {
    if (!url && !highlevelUrl) return;

    // If HighLevel URL is provided, use it directly
    if (highlevelUrl) {
      setQrCodeUrl(highlevelUrl);
      return;
    }

    // Otherwise, generate QR code using a public API (can be replaced with library)
    // Using qrcode.react library would be better, but this works for now
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;
    setQrCodeUrl(qrApiUrl);
  }, [url, highlevelUrl, size]);

  if (!display || !qrCodeUrl) return null;

  const positionClasses = {
    'bottom-right': 'bottom-16 right-16',
    'bottom-left': 'bottom-16 left-16',
    'top-right': 'top-16 right-16',
    'top-left': 'top-16 left-16'
  };

  return (
    <div
      className={`absolute ${positionClasses[position]} z-50 animate-fade-in`}
      style={{
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      {/* QR Code card */}
      <div className="bg-white p-6 rounded-lg shadow-2xl border-4 brand-border">
        {/* QR Code image */}
        <img
          src={qrCodeUrl}
          alt={`QR Code for ${url}`}
          width={size}
          height={size}
          className="rounded"
        />

        {/* Message/CTA */}
        {message && (
          <div className="mt-4 text-center">
            <p className="text-black font-semibold text-lg">
              {message}
            </p>
          </div>
        )}

        {/* Accent decoration */}
        <div className="absolute -top-2 -left-2 w-8 h-8 brand-gradient rounded-full"></div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 brand-gradient rounded-full"></div>
      </div>
    </div>
  );
}

/**
 * QRCodeWithTracking - HighLevel integration wrapper
 * Generates trackable QR codes via HighLevel API
 */
export function QRCodeWithTracking({
  targetUrl,
  campaignName,
  message,
  display = true,
  position = 'bottom-right',
  size = 200
}) {
  const [highlevelUrl, setHighlevelUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function generateHighLevelQR() {
      try {
        // Call HighLevel API to generate trackable QR code
        // This would be replaced with actual HighLevel API integration
        const response = await fetch('/api/highlevel/generate-qr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetUrl,
            campaignName,
            trackingEnabled: true
          })
        });

        const data = await response.json();
        setHighlevelUrl(data.qrCodeUrl);
      } catch (error) {
        console.error('Failed to generate HighLevel QR code:', error);
        // Fallback to regular QR code
        setHighlevelUrl(null);
      } finally {
        setLoading(false);
      }
    }

    if (targetUrl && campaignName) {
      generateHighLevelQR();
    }
  }, [targetUrl, campaignName]);

  if (loading) return null;

  return (
    <QRCode
      url={targetUrl}
      highlevelUrl={highlevelUrl}
      message={message}
      display={display}
      position={position}
      size={size}
    />
  );
}

/**
 * Custom CSS for fade-in animation
 */
const animationStyles = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
`;
