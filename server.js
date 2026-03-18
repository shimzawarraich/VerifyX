require('dotenv').config();
 
const express = require('express');
const app = express();
 
app.use(express.json());
app.use(express.static('public'));
 
const GRADIENT_API_URL = 'https://inference.do-ai.run/v1/chat/completions';
const GRADIENT_API_KEY = process.env.GRADIENT_API_KEY;
 
const LEVEL_DIFFICULTY = {
  1: 'Make it very obviously fake or manipulated — easy to detect.',
  2: 'Make it moderately subtle — some clues but not obvious.',
  3: 'Make it quite subtle and realistic — harder to detect.',
  4: 'Make it very convincing — a careful reader might be fooled.',
  5: 'Make it extremely realistic and nuanced — expert-level difficulty.',
};
 
// =============================================
//  POST /generate — called by game.js
// =============================================
app.post('/generate', async (req, res) => {
  const level = parseInt(req.body.level) || 1;
  const types = ['real', 'fake', 'manipulated'];
  const type = types[Math.floor(Math.random() * types.length)];
  const difficulty = LEVEL_DIFFICULTY[level] || LEVEL_DIFFICULTY[1];
 
  const prompt = `You are generating content for a media literacy game called VerifyX.
Generate a single news headline of type: "${type}".
 
Type definitions:
- "real": A factual, plausible headline about something a real news outlet might report.
- "fake": Completely fabricated misinformation — something that did not happen.
- "manipulated": A real-sounding headline where key facts have been subtly altered (wrong numbers, misattributed quotes, etc.).
 
Difficulty: ${difficulty}
 
Return ONLY valid JSON — no markdown, no code fences, nothing else. Format:
{
  "text": "The full headline here",
  "answer": "${type}",
  "explanation": "A 1-2 sentence explanation of why this headline is ${type}, including any specific clues to look for."
}`;
 
  // If no API key is set, return a fallback immediately
  if (!GRADIENT_API_KEY) {
    console.warn('No GRADIENT_API_KEY set — returning fallback question');
    return res.status(503).json({ error: 'API key not configured' });
  }
 
  try {
    const response = await fetch(GRADIENT_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GRADIENT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.3-70b-instruct',
        max_tokens: 300,
        temperature: 0.85,
        messages: [{ role: 'user', content: prompt }]
      })
    });
 
    if (!response.ok) {
      throw new Error(`Gradient API error: ${response.status}`);
    }
 
    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content || '';
    const cleaned = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
 
    if (!parsed.text || !parsed.answer || !parsed.explanation) {
      throw new Error('Invalid question shape from API');
    }
 
    res.json(parsed);
 
  } catch (err) {
    console.error('Gradient API call failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});
 
app.listen(3000, () => {
  console.log('VerifyX server running on http://localhost:3000');
});