import React from 'react';

/**
 * TitleCard - Episode title card with TattooNOW branding
 * Displays at the start of each episode
 */
export function TitleCard({ title, episodeNumber, airDate, host }) {
  return (
    <div className="slideshow-container flex items-center justify-center">
      {/* Background gradient */}
      <div className="absolute inset-0 brand-gradient opacity-20"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-16 max-w-5xl">
        {/* Episode number */}
        <div className="brand-accent text-2xl font-semibold mb-4 tracking-wider uppercase">
          Episode {episodeNumber}
        </div>

        {/* Episode title */}
        <h1 className="text-7xl font-bold mb-8 leading-tight">
          {title}
        </h1>

        {/* Air date */}
        {airDate && (
          <div className="text-2xl text-muted-foreground mb-12">
            {new Date(airDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        )}

        {/* Host info */}
        {host && (
          <div className="text-xl text-foreground/80">
            Hosted by <span className="brand-accent font-semibold">{host}</span>
          </div>
        )}

        {/* TattooNOW branding */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="text-muted-foreground text-lg">
            TattooNOW Weekly
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-2 brand-gradient"></div>
      <div className="absolute bottom-0 left-0 w-full h-2 brand-gradient"></div>
    </div>
  );
}
