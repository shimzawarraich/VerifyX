const express = require('express');
const app = express();
const questions = require('../data/questions.json');

app.use(express.static('public'));

app.get('/questions', (req, res) => {
  res.json(questions);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

app.post('/generate', async (req, res) => {
  const samples = [
    {
      text: "Scientists confirm chocolate improves memory overnight",
      answer: "fake"
    },
    {
      text: "Government releases new climate policy report",
      answer: "real"
    },
    {
      text: "Edited image exaggerates protest crowd size",
      answer: "manipulated"
    }
  ];

  const random = samples[Math.floor(Math.random() * samples.length)];
  res.json(random);
});
