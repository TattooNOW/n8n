import React, { useState, useEffect, useCallback } from 'react';
import { TitleCard } from './TitleCard';
import { PortfolioSlide } from './PortfolioSlide';
import { EducationSlide } from './EducationSlide';
import { LowerThird } from './LowerThird';
import { QRCode, QRCodeWithTracking } from './QRCode';

/**
 * SlideController - Main slideshow controller
 * Handles:
 * - Slide sequencing
 * - Keyboard controls
 * - Stream Deck integration (WebSocket/HTTP)
 * - Overlay toggling (QR codes, lower-thirds)
 */
export function SlideController({ episodeData }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [showLowerThird, setShowLowerThird] = useState(false);
  const [portfolioLayout, setPortfolioLayout] = useState('grid'); // 'grid' or 'fullscreen'

  // Build slides array from episode data
  const slides = buildSlides(episodeData);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          previousSlide();
          break;
        case 'q':
        case 'Q':
          toggleQR();
          break;
        case 'l':
        case 'L':
          toggleLowerThird();
          break;
        case 'g':
        case 'G':
          togglePortfolioLayout();
          break;
        case 'Home':
          setCurrentSlideIndex(0);
          break;
        case 'End':
          setCurrentSlideIndex(slides.length - 1);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [slides.length]);

  // Stream Deck WebSocket integration
  useEffect(() => {
    // Connect to Stream Deck WebSocket server
    const ws = new WebSocket('ws://localhost:9000/streamdeck');

    ws.onmessage = (event) => {
      const command = JSON.parse(event.data);

      switch (command.action) {
        case 'next':
          nextSlide();
          break;
        case 'previous':
          previousSlide();
          break;
        case 'toggleQR':
          toggleQR();
          break;
        case 'toggleLowerThird':
          toggleLowerThird();
          break;
        case 'togglePortfolioLayout':
          togglePortfolioLayout();
          break;
        case 'jumpToSegment':
          jumpToSegment(command.segmentNumber);
          break;
        default:
          console.warn('Unknown Stream Deck command:', command);
      }
    };

    ws.onerror = (error) => {
      console.warn('Stream Deck WebSocket not connected:', error.message);
      // Gracefully degrade - keyboard controls still work
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  // Navigation functions
  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
  }, [slides.length]);

  const previousSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const toggleQR = useCallback(() => {
    setShowQR((prev) => !prev);
  }, []);

  const toggleLowerThird = useCallback(() => {
    setShowLowerThird((prev) => !prev);
  }, []);

  const togglePortfolioLayout = useCallback(() => {
    setPortfolioLayout((prev) => (prev === 'grid' ? 'fullscreen' : 'grid'));
  }, []);

  const jumpToSegment = useCallback((segmentNumber) => {
    // Find the index of the first slide for the given segment
    const segmentIndex = slides.findIndex(
      (slide) => slide.segment === segmentNumber
    );
    if (segmentIndex >= 0) {
      setCurrentSlideIndex(segmentIndex);
    }
  }, [slides]);

  if (!episodeData || slides.length === 0) {
    return (
      <div className="slideshow-container flex items-center justify-center">
        <div className="text-4xl text-muted-foreground">
          No episode data loaded
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="relative">
      {/* Main slide content */}
      {renderSlide(currentSlide, portfolioLayout)}

      {/* Overlays */}
      {currentSlide.showLowerThird && (
        <LowerThird
          guestName={currentSlide.guestName}
          title={currentSlide.guestTitle}
          location={currentSlide.guestLocation}
          instagram={currentSlide.guestInstagram}
          display={showLowerThird}
        />
      )}

      {episodeData.QR_CODE_URL && (
        <QRCode
          url={episodeData.QR_CODE_URL}
          highlevelUrl={episodeData.HIGHLEVEL_QR_URL}
          message={episodeData.QR_CODE_MESSAGE || 'Book Your Consultation'}
          display={showQR}
        />
      )}

      {/* Slide counter (debug - can be hidden) */}
      <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded text-sm">
        {currentSlideIndex + 1} / {slides.length}
      </div>

      {/* Keyboard shortcuts hint (can be toggled off) */}
      <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded text-xs text-muted-foreground">
        ← → Next/Prev | Q: QR | L: Lower Third | G: Grid/Fullscreen
      </div>
    </div>
  );
}

/**
 * Build slides array from episode data
 */
function buildSlides(episodeData) {
  const slides = [];

  if (!episodeData) return slides;

  // Title card
  slides.push({
    type: 'title',
    title: episodeData.EPISODE_TITLE,
    episodeNumber: episodeData.EPISODE_NUMBER,
    airDate: episodeData.AIR_DATE,
    host: episodeData.HOST
  });

  // Segment 1
  if (episodeData.SEGMENT_1_TYPE === 'interview') {
    slides.push({
      type: 'portfolio',
      segment: 1,
      artistName: episodeData.SEGMENT_1_GUEST_NAME,
      artistStyle: episodeData.SEGMENT_1_GUEST_STYLE,
      artistLocation: episodeData.SEGMENT_1_GUEST_LOCATION,
      artistInstagram: episodeData.SEGMENT_1_GUEST_INSTAGRAM,
      images: episodeData.SEGMENT_1_PORTFOLIO_IMAGES || [],
      showLowerThird: true,
      guestName: episodeData.SEGMENT_1_GUEST_NAME,
      guestTitle: episodeData.SEGMENT_1_GUEST_TITLE,
      guestInstagram: episodeData.SEGMENT_1_GUEST_INSTAGRAM
    });
  } else if (episodeData.SEGMENT_1_TYPE === 'education') {
    // Parse education slides from presentation
    const educationSlides = parseEducationSlides(episodeData, 1);
    slides.push(...educationSlides);
  }

  // Segment 2
  if (episodeData.SEGMENT_2_TYPE === 'interview') {
    slides.push({
      type: 'portfolio',
      segment: 2,
      artistName: episodeData.SEGMENT_2_GUEST_NAME,
      artistStyle: episodeData.SEGMENT_2_GUEST_STYLE,
      artistLocation: episodeData.SEGMENT_2_GUEST_LOCATION,
      artistInstagram: episodeData.SEGMENT_2_GUEST_INSTAGRAM,
      images: episodeData.SEGMENT_2_PORTFOLIO_IMAGES || [],
      showLowerThird: true,
      guestName: episodeData.SEGMENT_2_GUEST_NAME,
      guestTitle: episodeData.SEGMENT_2_GUEST_TITLE,
      guestInstagram: episodeData.SEGMENT_2_GUEST_INSTAGRAM
    });
  } else if (episodeData.SEGMENT_2_TYPE === 'education') {
    const educationSlides = parseEducationSlides(episodeData, 2);
    slides.push(...educationSlides);
  }

  // Segment 3
  if (episodeData.SEGMENT_3_TYPE === 'interview') {
    slides.push({
      type: 'portfolio',
      segment: 3,
      artistName: episodeData.SEGMENT_3_GUEST_NAME,
      artistStyle: episodeData.SEGMENT_3_GUEST_STYLE,
      artistLocation: episodeData.SEGMENT_3_GUEST_LOCATION,
      artistInstagram: episodeData.SEGMENT_3_GUEST_INSTAGRAM,
      images: episodeData.SEGMENT_3_PORTFOLIO_IMAGES || [],
      showLowerThird: true,
      guestName: episodeData.SEGMENT_3_GUEST_NAME,
      guestTitle: episodeData.SEGMENT_3_GUEST_TITLE,
      guestInstagram: episodeData.SEGMENT_3_GUEST_INSTAGRAM
    });
  } else if (episodeData.SEGMENT_3_TYPE === 'education') {
    const educationSlides = parseEducationSlides(episodeData, 3);
    slides.push(...educationSlides);
  }

  return slides;
}

/**
 * Parse education slides from segment data
 */
function parseEducationSlides(episodeData, segmentNumber) {
  const slides = [];
  const slidesData = episodeData[`SEGMENT_${segmentNumber}_SLIDES`] || [];

  slidesData.forEach((slideData, index) => {
    slides.push({
      type: 'education',
      segment: segmentNumber,
      slideNumber: index + 1,
      title: slideData.title,
      visual: slideData.visual,
      keyPoints: slideData.keyPoints || [],
      stats: slideData.stats || [],
      layout: slideData.layout || 'split'
    });
  });

  return slides;
}

/**
 * Render individual slide based on type
 */
function renderSlide(slide, portfolioLayout) {
  switch (slide.type) {
    case 'title':
      return (
        <TitleCard
          title={slide.title}
          episodeNumber={slide.episodeNumber}
          airDate={slide.airDate}
          host={slide.host}
        />
      );

    case 'portfolio':
      return (
        <PortfolioSlide
          artistName={slide.artistName}
          artistStyle={slide.artistStyle}
          artistLocation={slide.artistLocation}
          artistInstagram={slide.artistInstagram}
          images={slide.images}
          layout={portfolioLayout}
        />
      );

    case 'education':
      return (
        <EducationSlide
          slideNumber={slide.slideNumber}
          title={slide.title}
          visual={slide.visual}
          keyPoints={slide.keyPoints}
          stats={slide.stats}
          layout={slide.layout}
        />
      );

    default:
      return (
        <div className="slideshow-container flex items-center justify-center">
          <div className="text-4xl text-muted-foreground">
            Unknown slide type: {slide.type}
          </div>
        </div>
      );
  }
}
