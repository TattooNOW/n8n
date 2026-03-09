import { motion } from 'framer-motion';
import { BRAND } from '../../lib/brand';

/**
 * ScriptSlide - Host script/rundown slide for live show
 * Displays talking points, intros, discussion prompts, and transition cues
 */
export default function ScriptSlide({ script }) {
  const {
    segment,
    timeCode,
    title,
    type, // 'intro', 'transition', 'discussion', 'outro', 'cue'
    talkingPoints,
    notes,
    cue
  } = script;

  const typeColors = {
    intro: BRAND.colors.primary,
    transition: BRAND.colors.accent,
    discussion: '#4ECDC4',
    outro: BRAND.colors.primary,
    cue: '#FFE66D'
  };

  const typeIcons = {
    intro: '🎙️',
    transition: '➡️',
    discussion: '💬',
    outro: '👋',
    cue: '⚡'
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${BRAND.colors.dark} 0%, #1a1a2e 100%)`,
        padding: '80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        fontFamily: BRAND.fonts.body
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '40px'
        }}
      >
        {/* Segment + Time */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              fontSize: '28px',
              fontFamily: BRAND.fonts.heading,
              color: typeColors[type] || BRAND.colors.primary,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <span>{typeIcons[type]}</span>
            <span>{segment}</span>
          </div>
          {timeCode && (
            <div
              style={{
                fontSize: '20px',
                color: BRAND.colors.textMuted,
                fontFamily: 'monospace',
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '8px 16px',
                borderRadius: '8px'
              }}
            >
              {timeCode}
            </div>
          )}
        </div>

        {/* Type Badge */}
        <div
          style={{
            fontSize: '16px',
            color: 'white',
            background: typeColors[type] || BRAND.colors.primary,
            padding: '12px 24px',
            borderRadius: '24px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            letterSpacing: '1px'
          }}
        >
          {type}
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          fontSize: '56px',
          fontFamily: BRAND.fonts.heading,
          color: 'white',
          marginBottom: '40px',
          lineHeight: '1.2'
        }}
      >
        {title}
      </motion.h1>

      {/* Talking Points */}
      {talkingPoints && talkingPoints.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ marginBottom: '40px' }}
        >
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {talkingPoints.map((point, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                style={{
                  fontSize: '32px',
                  color: BRAND.colors.text,
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px'
                }}
              >
                <span
                  style={{
                    color: typeColors[type] || BRAND.colors.primary,
                    fontSize: '40px',
                    lineHeight: '1'
                  }}
                >
                  •
                </span>
                <span style={{ flex: 1, lineHeight: '1.4' }}>{point}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Notes */}
      {notes && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            fontSize: '24px',
            color: BRAND.colors.textMuted,
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '24px',
            borderRadius: '12px',
            borderLeft: `4px solid ${typeColors[type] || BRAND.colors.primary}`,
            marginBottom: '24px',
            fontStyle: 'italic'
          }}
        >
          {notes}
        </motion.div>
      )}

      {/* Cue */}
      {cue && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{
            fontSize: '28px',
            color: '#1a1a2e',
            background: typeColors.cue,
            padding: '20px 32px',
            borderRadius: '12px',
            fontWeight: 'bold',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            boxShadow: '0 8px 32px rgba(255, 230, 109, 0.3)'
          }}
        >
          ⚡ {cue}
        </motion.div>
      )}

      {/* Footer Branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '80px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '18px',
          color: BRAND.colors.textMuted
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: BRAND.colors.primary
          }}
        />
        <span>TattooNOW Weekly</span>
      </motion.div>
    </div>
  );
}
