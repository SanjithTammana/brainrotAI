const BRAINROT_MARKERS = /\b(skibidi|sigma|rizz|aura|gyatt|fanum|cap|cooked|6[- ]?7|italian brainrot|tralalero|bombardiro|brainrot)\b/gi;

export function assessMascotState(text = '') {
  const markerCount = text.match(BRAINROT_MARKERS)?.length ?? 0;
  const punctuationBursts = text.match(/[!?]{2,}/g)?.length ?? 0;
  const shouting = (text.match(/[A-Z]/g)?.length ?? 0) > 8 ? 1 : 0;
  const score = markerCount * 2 + punctuationBursts + shouting;

  if (score >= 5) {
    return { mood: 'deeply-cooked', score, label: 'deeply cooked', thought: 'too much lore detected' };
  }
  if (score >= 2) {
    return { mood: 'concerned', score, label: 'slightly concerned', thought: 'checking the archives' };
  }
  return { mood: 'calm', score, label: 'composed', thought: 'ready to translate' };
}
