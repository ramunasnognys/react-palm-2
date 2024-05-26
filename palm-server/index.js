require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser'); // Add this to parse JSON body
const app = express();
const port = process.env.PORT || 3000;

const { TextServiceClient } = require("@google-ai/generativelanguage").v1beta2;
const { GoogleAuth } = require("google-auth-library");

const MODEL_NAME = "models/text-bison-001";
const API_KEY = process.env.API_KEY;

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

app.use(bodyParser.json()); // Middleware to parse JSON body

app.post('/api', (req, res) => {
  const prompt = req.body.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  client
    .generateText({
      model: MODEL_NAME,
      prompt: {
        text: prompt,
      },
    })
    .then((result) => {
      const answer = result[0].candidates[0].output;
      res.json({ answer });
      console.log(JSON.stringify(result));
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
