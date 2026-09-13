'use client';

import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Card,
} from '@mui/material';

const ParentContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  minHeight: '100dvh',
  padding: 'clamp(20px, 4vw, 48px) 16px 40px',
  background: 'var(--color-bg)',
});

const LandingHero = styled(Box)({
  width: 'min(100%, 960px)',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(220px, 0.55fr)',
  alignItems: 'center',
  gap: 'clamp(20px, 5vw, 64px)',
  marginBottom: 'clamp(20px, 4vw, 44px)',
  '@media (max-width: 680px)': { gridTemplateColumns: '1fr', gap: '12px' },
});

const HeroTitle = styled(Typography)({
  marginTop: '8px',
  maxWidth: '11ch',
  color: 'var(--color-ink)',
  fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
  fontWeight: 780,
  letterSpacing: '-0.075em',
  lineHeight: 0.92,
});

const HeroKicker = styled(Typography)({
  color: 'var(--color-butter)',
  fontSize: '0.76rem',
  fontWeight: 800,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
});

const MascotStage = styled(Box)({
  position: 'relative',
  display: 'grid',
  placeItems: 'center',
  minHeight: '250px',
  border: '1px solid var(--color-border)',
  borderRadius: '28px',
  background: 'var(--color-surface)',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '68%',
    aspectRatio: '1',
    borderRadius: '50%',
    background: 'var(--color-accent-soft)',
    opacity: 0.6,
  },
  '@media (max-width: 680px)': { minHeight: '180px', order: -1 },
});

const Mascot = styled('img')({
  position: 'relative',
  zIndex: 1,
  width: 'min(100%, 320px)',
  maxHeight: '280px',
  objectFit: 'contain',
  filter: 'drop-shadow(0 18px 12px rgba(0, 21, 12, 0.28))',
});

const ChatCard = styled(Card)({
  width: 'min(100%, 960px)',
  height: 'min(760px, calc(100dvh - 24px))',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '20px',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-ink)',
  boxShadow: 'var(--shadow-panel)',
  fontFamily: 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif',
  overflow: 'hidden',
});

const StickyHeader = styled(Box)({
  position: 'sticky',
  top: 0,
  zIndex: 1,
  backgroundColor: 'var(--color-surface-2)',
  color: 'var(--color-ink)',
  padding: 'var(--space-xl)',
  borderBottom: '1px solid var(--color-border)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
});

const HeaderLine = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const HeaderMascot = styled('img')({
  width: '44px',
  height: '44px',
  objectFit: 'contain',
  filter: 'drop-shadow(0 5px 4px rgba(0, 21, 12, 0.28))',
});

const ModeButton = styled(Button)(({ selected }) => ({
  border: '1px solid var(--color-border)',
  borderRadius: '10px',
  color: selected ? 'var(--color-bg)' : 'var(--color-muted)',
  background: selected ? 'var(--color-accent)' : 'transparent',
  fontWeight: selected ? 800 : 600,
  padding: '8px 11px',
  textTransform: 'none',
  transition: 'background-color 160ms ease-out, color 160ms ease-out, transform 160ms ease-out',
  '&:hover': { background: selected ? 'var(--color-accent-strong)' : 'var(--color-surface)' },
  '&:active': { transform: 'scale(0.98)' },
  '&:focus-visible': { outline: '3px solid var(--color-butter)', outlineOffset: '2px' },
}));

const MascotStatus = styled(Typography)({
  marginTop: '8px',
  color: 'var(--color-butter)',
  fontSize: '0.78rem',
  fontWeight: 750,
});

const BRAINROT_MARKERS = /\b(skibidi|sigma|rizz|aura|gyatt|fanum|cap|cooked|6[- ]?7|italian brainrot|tralalero|bombardiro|brainrot)\b/gi;

function getMascotMood(text) {
  const markerCount = text.match(BRAINROT_MARKERS)?.length ?? 0;
  const punctuationCount = text.match(/[!?]{2,}/g)?.length ?? 0;
  const uppercaseCount = text.match(/[A-Z]/g)?.length ?? 0;
  const score = markerCount * 2 + punctuationCount + (uppercaseCount > 8 ? 1 : 0);
  if (score >= 5) return 'deeply-cooked';
  if (score >= 2) return 'concerned';
  return 'calm';
}

const Intro = styled(Typography)({
  marginTop: 'var(--space-xs)',
  fontSize: '0.9rem',
  lineHeight: 1.5,
  color: 'var(--color-muted)',
});

const MessagesContainer = styled(Box)({
  flexGrow: 1,
  overflowY: 'auto',
  padding: 'var(--space-xl)',
  scrollbarWidth: 'thin',
  scrollbarColor: 'var(--color-border) var(--color-bg)',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'var(--color-bg)',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'var(--color-border)',
    borderRadius: '4px',
  },
});

const MessageBubble = styled(Box)(({ sender }) => ({
  display: 'flex',
  justifyContent: sender === 'user' ? 'flex-end' : 'flex-start',
  marginBottom: 'var(--space-md)',
  '& div': {
    display: 'inline-block',
    padding: '12px 16px',
    borderRadius: '16px',
    border: '1px solid var(--color-border)',
    background: sender === 'user' ? 'var(--color-surface-2)' : 'var(--color-bg)',
    color: sender === 'user' ? 'var(--color-ink)' : 'var(--color-muted)',
    maxWidth: 'min(78%, 680px)',
    wordWrap: 'break-word',
    fontSize: '1rem',
    lineHeight: 1.55,
  },
}));

const EmptyState = styled(Box)({
  display: 'grid',
  placeItems: 'center',
  minHeight: '100%',
  color: 'var(--color-muted)',
  textAlign: 'center',
  padding: 'var(--space-xl)',
});

const InputContainer = styled(Box)({
  padding: 'var(--space-lg)',
  backgroundColor: 'var(--color-surface)',
  borderTop: '1px solid var(--color-border)',
  display: 'flex',
  gap: 'var(--space-sm)',
  alignItems: 'center',
});

const StyledButton = styled(Button)(() => ({
  backgroundColor: 'var(--color-accent)',
  color: 'var(--color-bg)',
  borderRadius: '12px',
  textTransform: 'none',
  padding: '10px 16px',
  minWidth: '112px',
  fontWeight: 700,
  transition: 'background-color 160ms ease-out, transform 160ms ease-out',
  '&:hover': {
    backgroundColor: 'var(--color-accent-strong)',
  },
  '&:active': {
    transform: 'translateY(1px)',
  },
  '&:focus-visible': {
    outline: '3px solid var(--color-accent-strong)',
    outlineOffset: '2px',
  },
}));

export const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('brainrot-to-plain');
  const [mascotMood, setMascotMood] = useState('calm');
  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text, mode }),
      });

      const data = await response.json();

      if (response.ok) {
        const botMessage = {
          id: Date.now() + 1,
          sender: 'bot',
          text: data.response,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          sender: 'bot',
          text: data.error || 'Something went wrong',
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error fetching chat:', error);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'An unexpected error occurred.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const selectMode = (nextMode) => {
    setMode(nextMode);
    setMessages([]);
    setInput('');
    setMascotMood('calm');
  };

  const placeholder =
    mode === 'brainrot-to-plain'
      ? 'Paste slang or brainrot to translate...'
      : mode === 'plain-to-brainrot'
        ? 'Write in plain English...'
        : 'Ask the rot anything...';

  return (
    <>
      <ParentContainer>
        <ChatCard>
          <StickyHeader>
            <HeaderLine>
              <HeaderMascot className={`mascot mascot-${loading ? 'thinking' : mascotMood}`} src="/art/moss-messenger.png" alt="" aria-hidden="true" />
              <Typography component="h2" variant="h5" fontWeight={780}>BrainrotAI</Typography>
            </HeaderLine>
            <Intro>
              The family-safe translation desk for extremely online situations.
            </Intro>
            <MascotStatus aria-live="polite">
              Mascot status: {loading ? 'consulting the archives' : mascotMood === 'deeply-cooked' ? 'deeply cooked' : mascotMood === 'concerned' ? 'slightly concerned' : 'composed'}
            </MascotStatus>
            <Box role="group" aria-label="Translation direction" sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              <ModeButton selected={mode === 'brainrot-to-plain'} onClick={() => selectMode('brainrot-to-plain')} aria-pressed={mode === 'brainrot-to-plain'}>
                Brainrot to plain English
              </ModeButton>
              <ModeButton selected={mode === 'plain-to-brainrot'} onClick={() => selectMode('plain-to-brainrot')} aria-pressed={mode === 'plain-to-brainrot'}>
                Plain English to brainrot
              </ModeButton>
              <ModeButton selected={mode === 'brainrot-chat'} onClick={() => selectMode('brainrot-chat')} aria-pressed={mode === 'brainrot-chat'}>
                Talk to the rot
              </ModeButton>
            </Box>
          </StickyHeader>

          <MessagesContainer role="log" aria-live="polite" aria-label="Translation history">
            {messages.length === 0 && (
              <EmptyState>
                <Box>
                  <Typography variant="h6" component="h2" color="inherit">
                    {mode === 'brainrot-chat' ? 'The rot is listening.' : 'Pick a direction, then paste a phrase.'}
                  </Typography>
                  <Typography sx={{ mt: 1, maxWidth: 420 }}>
                    {mode === 'brainrot-chat'
                      ? 'Ask a question. The answer will be extremely online.'
                      : 'Short slang terms can use dictionary context. Full phrases are translated directly.'}
                  </Typography>
                </Box>
              </EmptyState>
            )}
            {messages.map((msg) => (
              <MessageBubble key={msg.id} sender={msg.sender}>
                <div>{msg.text}</div>
              </MessageBubble>
            ))}
            {loading && (
              <MessageBubble sender="bot"><div>Consulting the meme archives...</div></MessageBubble>
            )}
            <div ref={messageEndRef}></div>
          </MessagesContainer>

          <form onSubmit={handleSubmit}>
            <InputContainer>
              <TextField
                variant="outlined"
                placeholder={placeholder}
                aria-label={placeholder}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setMascotMood(getMascotMood(e.target.value));
                }}
                fullWidth
                InputProps={{
                  style: {
                    borderRadius: '12px',
                    background: 'var(--color-surface-2)',
                    color: 'var(--color-ink)',
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-border)' },
                  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--color-accent)',
                  },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--color-accent-strong)',
                    borderWidth: '2px',
                  },
                  '& input::placeholder': { color: 'var(--color-muted)', opacity: 1 },
                }}
              />
              <StyledButton type="submit" disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : mode === 'brainrot-chat' ? 'Send it' : 'Translate'}
              </StyledButton>
            </InputContainer>
          </form>
        </ChatCard>
      </ParentContainer>
    </>
  );
};

const LandingPanel = styled(Card)({
  width: 'min(100%, 960px)',
  padding: 'clamp(20px, 4vw, 42px)',
  borderRadius: '28px',
  border: '1px solid var(--color-border)',
  background: 'var(--color-surface)',
  color: 'var(--color-ink)',
  boxShadow: 'var(--shadow-panel)',
});

const Incident = styled(Box)({
  marginTop: '24px',
  padding: '18px',
  borderRadius: '16px',
  border: '1px solid var(--color-border)',
  background: 'var(--color-bg)',
});

function LandingPage() {
  return (
    <ParentContainer component="main">
      <LandingHero component="header">
        <Box>
          <HeroKicker>Parent-child communications office</HeroKicker>
          <HeroTitle component="h1">We translate whatever that was.</HeroTitle>
          <Typography sx={{ mt: 2, maxWidth: 510, color: 'var(--color-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            A satire-shaped translator for families, group chats, 6-7, and every Italian brainrot emergency.
          </Typography>
          <StyledButton href="/chat" sx={{ mt: 3, backgroundColor: 'var(--color-butter)' }}>
            Enter the translation desk
          </StyledButton>
        </Box>
        <MascotStage aria-label="BrainrotAI mascot">
          <Mascot className="mascot mascot-calm" src="/art/moss-messenger.png" alt="A mossy green messenger holding two speech bubbles" />
        </MascotStage>
      </LandingHero>

      <LandingPanel>
        <Typography component="h2" variant="h4" fontWeight={780} sx={{ letterSpacing: '-0.05em' }}>
          A public service for sentences that escaped containment.
        </Typography>
        <Typography sx={{ mt: 1.5, maxWidth: 650, color: 'var(--color-muted)', lineHeight: 1.6 }}>
          Translate into plain English, make normal English terminally online, or have a full conversation with an AI that has seen too much of the feed.
        </Typography>
        <Incident>
          <HeroKicker>Sample incident report</HeroKicker>
          <Typography sx={{ mt: 1, color: 'var(--color-coral)', fontWeight: 760 }}>
            “The Italian brainrot is giving 6-7 and my aura is cooked.”
          </Typography>
          <Typography sx={{ mt: 1, color: 'var(--color-muted)', lineHeight: 1.55 }}>
            The translation desk will not judge. The moss messenger may become visibly concerned.
          </Typography>
        </Incident>
      </LandingPanel>
    </ParentContainer>
  );
}

export default LandingPage;
