import React from 'react';

/**
 * LowerThird - Guest information overlay
 * Displays at bottom of screen during interviews
 * Can be toggled on/off via Stream Deck or keyboard
 */
export function LowerThird({
  guestName,
  title,
  location,
  instagram,
  website,
  display = true,
  position = 'bottom-left' // 'bottom-left', 'bottom-right', 'bottom-center'
}) {
  if (!display) return null;

  const positionClasses = {
    'bottom-left': 'bottom-16 left-16',
    'bottom-right': 'bottom-16 right-16',
    'bottom-center': 'bottom-16 left-1/2 transform -translate-x-1/2'
  };

  return (
    <div
      className={`absolute ${positionClasses[position]} z-50 animate-slide-in-bottom`}
      style={{
        animation: 'slideInBottom 0.4s ease-out'
      }}
    >
      {/* Background with brand gradient */}
      <div className="relative bg-card/95 backdrop-blur-sm border-l-4 brand-border rounded-lg overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 brand-gradient opacity-10"></div>

        {/* Content */}
        <div className="relative z-10 px-8 py-5 min-w-[400px]">
          {/* Guest name */}
          <h3 className="text-3xl font-bold mb-1">{guestName}</h3>

          {/* Title/Role */}
          {title && (
            <div className="brand-accent text-lg font-semibold mb-2">
              {title}
            </div>
          )}

          {/* Additional info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {location && <span>{location}</span>}
            {instagram && (
              <>
                {location && <span>•</span>}
                <span className="text-accent">@{instagram}</span>
              </>
            )}
            {website && (
              <>
                {(location || instagram) && <span>•</span>}
                <span>{website}</span>
              </>
            )}
          </div>
        </div>

        {/* Accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-1 brand-gradient"></div>
      </div>
    </div>
  );
}

/**
 * Custom CSS for slide-in animation
 * Add to brand.css if needed
 */
const animationStyles = `
@keyframes slideInBottom {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in-bottom {
  animation: slideInBottom 0.4s ease-out;
}
`;
