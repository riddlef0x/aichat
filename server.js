const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages required' });
    }

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    
    if (!ANTHROPIC_API_KEY) {
      console.error('Missing ANTHROPIC_API_KEY');
      return res.status(500).json({ error: 'API key not configured' });
    }

    // System prompt
    const systemPrompt = `You are Robin Leonard's AI assistant. You're direct, helpful, and knowledgeable about Salesforce and AI. Keep responses conversational and under 100 words.`;

    // Clean messages
    const cleanMessages = messages.slice(-10).map((msg) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content
    }));

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2024-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 150,
        system: systemPrompt,
        messages: cleanMessages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, response.statusText, errorText);
      return res.status(500).json({ 
        error: 'AI service error',
        details: `${response.status}: ${errorText}` 
      });
    }

    const data = await response.json();
    const reply = data.content[0]?.text || 'Sorry, I encountered an error.';

    res.json({ reply });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Chat backend running on port ${PORT} (all interfaces)`);
});