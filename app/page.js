'use client';

import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import Mascot from './components/Mascot';
import { assessMascotState } from './lib/mascot-state';

const ParentContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  minHeight: '100dvh',
  padding: '24px 16px',
  background: 'var(--color-bg)',
});

const LandingHero = styled(Box)({
  width: 'min(100%, 960px)',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(220px, 0.55fr)',
  alignItems: 'center',
  gap: 'clamp(20px, 5vw, 64px)',
  marginBottom: 'clamp(14px, 2.5vh, 28px)',
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
  fontFamily: 'var(--font-display)',
});

const HeroKicker = styled(Typography)({
  color: 'var(--color-butter)',
  fontSize: '0.76rem',
  fontWeight: 800,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  fontFamily: 'var(--font-utility)',
});

const MascotStage = styled(Box)({
  position: 'relative',
  display: 'grid',
  placeItems: 'center',
  minHeight: '250px',
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

const ChatCard = styled(Box)({
  width: 'min(100%, 1160px)',
  height: 'calc(100dvh - 48px)',
  display: 'grid',
  gridTemplateColumns: 'minmax(300px, 0.78fr) minmax(0, 1.35fr)',
  gridTemplateRows: '1fr auto',
  background: 'var(--color-bg)',
  color: 'var(--color-ink)',
  fontFamily: 'var(--font-body)',
  overflow: 'visible',
  '@media (max-width: 760px)': {
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'auto minmax(360px, 1fr) auto',
    minHeight: '100dvh',
  },
});

const StickyHeader = styled(Box)({
  position: 'sticky',
  top: 0,
  zIndex: 1,
  gridColumn: '1',
  gridRow: '1 / span 2',
  background: 'transparent',
  color: 'var(--color-ink)',
  padding: 'clamp(20px, 3vw, 44px) clamp(16px, 3vw, 36px) 28px 0',
  borderRight: '1px solid rgba(139, 207, 141, 0.26)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  '@media (max-width: 760px)': {
    gridColumn: '1',
    gridRow: '1',
    padding: '24px 20px 10px',
    borderRight: 0,
    borderBottom: '1px solid rgba(139, 207, 141, 0.26)',
  },
});

const HeaderLine = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '6px',
  width: '100%',
});

const ModeButton = styled(Button)(({ selected }) => ({
  border: '1px solid var(--color-border)',
  borderRadius: '10px',
  color: selected ? 'var(--color-bg)' : 'var(--color-muted)',
  background: selected ? 'var(--color-accent)' : 'transparent',
  fontWeight: selected ? 500 : 400,
  letterSpacing: '-0.045em',
  padding: '8px 11px',
  textTransform: 'none',
  transition: 'background-color 160ms ease-out, color 160ms ease-out, transform 160ms ease-out',
  '&:hover': { background: selected ? 'var(--color-accent-strong)' : 'var(--color-surface)' },
  '&:active': { transform: 'scale(0.98)' },
  '&:focus-visible': { outline: '3px solid var(--color-butter)', outlineOffset: '2px' },
}));

const Intro = styled(Typography)({
  marginTop: 'var(--space-xs)',
  fontSize: '0.9rem',
  lineHeight: 1.5,
  color: 'var(--color-muted)',
});

const MessagesContainer = styled(Box)({
  gridColumn: '2',
  gridRow: '1',
  flexGrow: 1,
  overflowY: 'auto',
  padding: 'clamp(28px, 4vw, 56px)',
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
  '@media (max-width: 760px)': { gridColumn: '1', gridRow: '2', padding: '28px 20px' },
});

const MessageBubble = styled(Box)(({ sender }) => ({
  display: 'flex',
  justifyContent: sender === 'user' ? 'flex-end' : 'flex-start',
  marginBottom: 'var(--space-md)',
  '& div': {
    display: 'inline-block',
    padding: '12px 16px',
    borderRadius: sender === 'user' ? '22px 22px 4px 22px' : '4px 22px 22px 22px',
    border: '1px solid rgba(139, 207, 141, 0.3)',
    background: sender === 'user' ? 'linear-gradient(135deg, rgba(15, 61, 39, 0.92), rgba(77, 147, 103, 0.22))' : 'transparent',
    color: sender === 'user' ? 'var(--color-ink)' : 'var(--color-muted)',
    maxWidth: 'min(78%, 680px)',
    wordWrap: 'break-word',
    fontSize: 'clamp(1rem, 1.5vw, 1.12rem)',
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
  gridColumn: '2',
  gridRow: '2',
  padding: '20px clamp(20px, 4vw, 56px) 32px',
  backgroundColor: 'transparent',
  borderTop: '1px solid rgba(139, 207, 141, 0.22)',
  display: 'flex',
  gap: 'var(--space-sm)',
  alignItems: 'center',
  '@media (max-width: 760px)': { gridColumn: '1', gridRow: '3', padding: '16px 20px 26px' },
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <HeroKicker>Translation chamber</HeroKicker>
                <Button href="/" variant="text" sx={{ color: 'var(--color-muted)', minWidth: 0, p: 0, textTransform: 'none', fontFamily: 'var(--font-body)' }}>
                  ← Home
                </Button>
              </Box>
              <Typography className="display-type" component="h1" variant="h3" fontWeight={820} sx={{ letterSpacing: '-0.05em' }}>BrainrotAI</Typography>
            </HeaderLine>
            <Box sx={{ width: 'min(100%, 300px)', alignSelf: 'center', mt: { xs: 1, md: 2 }, mb: { xs: 4, md: 5 } }}>
              <Mascot mood={mascotMood} activity={loading ? 'thinking' : 'idle'} text={input} alt="Moss, the BrainrotAI messenger" />
            </Box>
            <Intro>
              Feed Moss a phrase. The more cooked it gets, the less composed he becomes.
            </Intro>
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
              <MessageBubble key={msg.id} sender={msg.sender} className="magic-message">
                <div>{msg.text}</div>
              </MessageBubble>
            ))}
            {loading && (
              <MessageBubble sender="bot" className="magic-message"><div>Consulting the meme archives...</div></MessageBubble>
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
                  setMascotMood(assessMascotState(e.target.value).mood);
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

const LandingPanel = styled(Box)({
  width: 'min(100%, 960px)',
  padding: 'clamp(16px, 3vw, 32px)',
  borderTop: '1px solid var(--color-border)',
  background: 'transparent',
  color: 'var(--color-ink)',
});

const LandingContainer = styled(Box)({
  minHeight: '100dvh',
  width: '100%',
  display: 'grid',
  alignContent: 'center',
  justifyItems: 'center',
  gap: 'clamp(14px, 2.5vh, 28px)',
  padding: 'clamp(16px, 3vh, 40px) 16px',
  overflow: 'hidden',
  background: 'var(--color-bg)',
  '@media (max-height: 760px)': {
    paddingTop: '12px',
    paddingBottom: '12px',
    gap: '12px',
    '& .landing-title': { fontSize: 'clamp(2.6rem, 9vh, 4.5rem)' },
    '& .landing-mascot': { minHeight: '170px' },
    '& .landing-panel-copy': { display: 'none' },
  },
  '@media (max-width: 680px)': {
    overflowY: 'auto',
    alignContent: 'start',
  },
});

const Incident = styled(Box)({
  marginTop: '24px',
  padding: '18px 0 0',
  borderTop: '1px solid rgba(139, 207, 141, 0.25)',
});

function LandingPage() {
  return (
    <LandingContainer component="main">
      <LandingHero component="header">
        <Box>
          <HeroKicker>Parent-child communications office</HeroKicker>
          <HeroTitle className="landing-title display-type" component="h1">We translate whatever that was.</HeroTitle>
          <Typography sx={{ mt: 2, maxWidth: 510, color: 'var(--color-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            A satire-shaped translator for families, group chats, 6-7, and every Italian brainrot emergency.
          </Typography>
          <StyledButton href="/chat" sx={{ mt: 3, backgroundColor: 'var(--color-butter)' }}>
            Enter the translation desk
          </StyledButton>
        </Box>
        <MascotStage className="landing-mascot" aria-label="BrainrotAI mascot">
          <Mascot mood="calm" alt="Moss, the mossy green messenger holding two speech bubbles" />
        </MascotStage>
      </LandingHero>

      <LandingPanel>
        <Typography className="display-type" component="h2" variant="h4" fontWeight={780} sx={{ letterSpacing: '-0.05em' }}>
          A public service for sentences that escaped containment.
        </Typography>
        <Typography className="landing-panel-copy" sx={{ mt: 1.5, maxWidth: 650, color: 'var(--color-muted)', lineHeight: 1.6 }}>
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
    </LandingContainer>
  );
}

export default LandingPage;
