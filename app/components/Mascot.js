'use client';

import { useRef } from 'react';
import { Box, Typography } from '@mui/material';

const MOOD_COPY = {
  calm: 'intact',
  concerned: 'wilting',
  'deeply-cooked': 'rotting',
};

export function MascotBody({ mood, activity, alt }) {
  return (
    <Box className="mascot-body" data-mood={mood} data-activity={activity}>
      <span className="mascot-shadow" aria-hidden="true" />
      <span className="mascot-arm mascot-arm-left" aria-hidden="true" />
      <span className="mascot-arm mascot-arm-right" aria-hidden="true" />
      <img src="/art/moss-messenger.png" alt={alt} />
      <span className="mascot-spark mascot-spark-one" aria-hidden="true" />
      <span className="mascot-spark mascot-spark-two" aria-hidden="true" />
    </Box>
  );
}

export function MascotStatus({ mood, activity = 'idle', compact = false }) {
  const text = activity === 'thinking' ? 'processing bad vibes' : MOOD_COPY[mood] ?? MOOD_COPY.calm;
  return (
    <Box className="mascot-status" data-mood={mood} data-activity={activity} aria-live="polite">
      <span className="mascot-status-dot" aria-hidden="true" />
      {!compact && <Typography component="span">Moss is {text}</Typography>}
    </Box>
  );
}

function MagicWords({ text, mood }) {
  const words = text.trim().split(/\s+/).filter(Boolean).slice(-3);
  if (!words.length) return null;

  return (
    <Box className="mascot-magic-words" data-mood={mood} aria-hidden="true">
      {words.map((word, index) => <span key={`${word}-${index}`}>{word}</span>)}
    </Box>
  );
}

export default function Mascot({ mood = 'calm', activity = 'idle', compact = false, text = '', alt = 'Moss, the BrainrotAI messenger' }) {
  const stageRef = useRef(null);

  const followPointer = (event) => {
    const stage = stageRef.current;
    if (!stage || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = stage.getBoundingClientRect();
    const horizontal = ((event.clientX - bounds.left) / bounds.width - 0.5) * 14;
    const vertical = ((event.clientY - bounds.top) / bounds.height - 0.5) * 8;
    stage.style.setProperty('--mascot-x', `${horizontal.toFixed(1)}px`);
    stage.style.setProperty('--mascot-y', `${vertical.toFixed(1)}px`);
  };

  const settle = () => {
    stageRef.current?.style.setProperty('--mascot-x', '0px');
    stageRef.current?.style.setProperty('--mascot-y', '0px');
  };

  return (
    <Box
      ref={stageRef}
      className="mascot-character"
      data-mood={mood}
      data-activity={activity}
      data-compact={compact ? 'true' : 'false'}
      onPointerMove={followPointer}
      onPointerLeave={settle}
    >
      <MascotBody mood={mood} activity={activity} alt={alt} />
      <MagicWords text={text} mood={mood} />
      <MascotStatus mood={mood} activity={activity} compact={compact} />
    </Box>
  );
}
