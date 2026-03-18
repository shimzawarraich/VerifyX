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

// Format definitions sent to the AI
const FORMAT_PROMPTS = {
  headline: {
    label: 'headline',
    instruction: 'Write a news headline as it would appear on a major outlet like BBC, CNN or Reuters.',
  },
  social: {
    label: 'social media post',
    instruction: 'Write a social media post (Twitter/X or Facebook style). Include realistic elements like emojis, hashtags, or urgent language where appropriate. Keep it under 280 characters.',
  },
  statistic: {
    label: 'statistic or data claim',
    instruction: 'Write a statistic or data claim as it might appear in an article, infographic caption, or viral post. Include a specific number, percentage, or figure.',
  },
  image_description: {
    label: 'viral image report',
    instruction: 'Describe a photo or image circulating online, including its caption and claimed context. Write it as a journalist would when fact-checking a viral image.',
  },
};

app.post('/generate', async (req, res) => {
  const level = parseInt(req.body.level) || 1;

  const types   = ['real', 'fake', 'manipulated'];
  const formats = ['headline', 'social', 'statistic', 'image_description'];

  const type     = types[Math.floor(Math.random() * types.length)];
  const format   = formats[Math.floor(Math.random() * formats.length)];
  const difficulty = LEVEL_DIFFICULTY[level] || LEVEL_DIFFICULTY[1];
  const formatDef  = FORMAT_PROMPTS[format];

  const prompt = `You are generating content for a media literacy game called VerifyX.

Generate a single piece of content of format: "${formatDef.label}" and type: "${type}".

Format instruction: ${formatDef.instruction}

Type definitions:
- "real": Factual, accurate content that a legitimate source would produce.
- "fake": Completely fabricated misinformation — something that did not happen or is entirely invented.
- "manipulated": Real-sounding content where key facts have been subtly altered (wrong numbers, misattributed quotes, false captions, doctored context, etc.).

Difficulty: ${difficulty}

Also generate a short hint — a 1-sentence clue that nudges the player toward the correct answer WITHOUT directly revealing it. The hint should point to a specific red flag or verification technique.

Return ONLY valid JSON — no markdown, no code fences, nothing else:
{
  "format": "${format}",
  "text": "The full content here",
  "answer": "${type}",
  "explanation": "A 1-2 sentence explanation of why this is ${type}, with specific clues.",
  "hint": "A 1-sentence nudge toward the correct classification without giving it away."
}`;

  if (!GRADIENT_API_KEY) {
    console.warn('No GRADIENT_API_KEY set — returning 503');
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
        max_tokens: 400,
        temperature: 0.88,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) throw new Error(`Gradient API error: ${response.status}`);

    const data     = await response.json();
    const rawText  = data.choices?.[0]?.message?.content || '';
    const cleaned  = rawText.replace(/```json|```/g, '').trim();
    const parsed   = JSON.parse(cleaned);

    if (!parsed.text || !parsed.answer || !parsed.explanation || !parsed.hint) {
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