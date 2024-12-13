'use client';

import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { Box, TextField, Button, CircularProgress, Typography, Card } from '@mui/material';

const ParentContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  overflow: 'hidden', // Ensure no external scroll
});

const ChatCard = styled(Card)(({ theme }) => ({
  width: '95vw',
  height: '95vh',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  backgroundColor: '#001F00',
  color: '#d1f7d1',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  fontFamily: 'Arial, sans-serif',
  overflow: 'hidden',
}));

const StickyHeader = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 10,
  backgroundColor: '#0B3B0B',
  color: '#d1f7d1',
  padding: '16px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
}));

const FeaturesList = styled(Box)(({ theme }) => ({
  marginTop: '8px',
  fontSize: '0.9rem',
  lineHeight: '1.4',
  color: '#a3d7a3',
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  padding: '16px',
  scrollbarWidth: 'thin',
  scrollbarColor: '#063806 #001F00',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#001F00',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#063806',
    borderRadius: '4px',
  },
}));

const MessageBubble = styled(Box)(({ sender, theme }) => ({
  display: 'flex',
  justifyContent: sender === 'user' ? 'flex-end' : 'flex-start',
  marginBottom: '12px',
  '& div': {
    display: 'inline-block',
    padding: '12px 18px',
    borderRadius: '16px',
    background: sender === 'user' ? '#0B3B0B' : '#111',
    color: sender === 'user' ? '#d1f7d1' : '#a3d7a3',
    maxWidth: '70%',
    wordWrap: 'break-word',
    fontSize: '1rem',
    lineHeight: '1.4',
    boxShadow: sender === 'user'
      ? '0 2px 6px rgba(0, 128, 0, 0.2)'
      : '0 2px 6px rgba(0, 0, 0, 0.4)',
    transition: 'background 0.3s ease, color 0.3s ease',
  },
}));

const InputContainer = styled(Box)(({ theme }) => ({
  padding: '16px',
  backgroundColor: '#001F00',
  borderTop: '1px solid #063806',
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
}));

const StyledButton = styled(Button)(() => ({
  background: 'linear-gradient(to right, #145214, #063806)',
  color: '#d1f7d1',
  borderRadius: '30px',
  textTransform: 'none',
  padding: '10px 20px',
  minWidth: '100px',
  transition: 'background 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(to right, #063806, #145214)',
  },
}));

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
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
        body: JSON.stringify({ message: userMessage.text }),
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <>
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden; 
          background: #f0f0f0; 
        }
      `}</style>

      <ParentContainer>
        <ChatCard>
          <StickyHeader>
            <Typography variant="h6">BrainRotAI</Typography>
            <FeaturesList>
              <div>• Bridges communication gaps between generations</div>
              <div>• Makes learning more fun</div>
              <div>• Translates kid slang for parents</div>
            </FeaturesList>
          </StickyHeader>

          <MessagesContainer>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} sender={msg.sender}>
                <div>{msg.text}</div>
              </MessageBubble>
            ))}
            <div ref={messageEndRef}></div>
          </MessagesContainer>

          <form onSubmit={handleSubmit}>
            <InputContainer>
              <TextField
                variant="outlined"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                fullWidth
                InputProps={{
                  style: {
                    borderRadius: '30px',
                    background: '#0B3B0B',
                    color: '#d1f7d1',
                  },
                }}
              />
              <StyledButton type="submit" disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Send'}
              </StyledButton>
            </InputContainer>
          </form>
        </ChatCard>
      </ParentContainer>
    </>
  );
};

export default ChatPage;
