require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const { TextServiceClient } =
  require("@google-ai/generativelanguage").v1beta2;

const { GoogleAuth } = require("google-auth-library");

const MODEL_NAME = "models/text-bison-001";
const API_KEY = process.env.API_KEY;

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

let answer = null;

const prompt = "Write me short story about ginger cat and browny dog";

app.get('/api', (req, res) => {
  client
    .generateText({
      model: MODEL_NAME,
      prompt: {
        text: prompt,
      },
    })
    .then((result) => {
      answer = result[0].candidates[0].output;
      res.json(answer);
      console.log(JSON.stringify(result));
    }).catch((err) => {
      console.error(err.details);
      res.json(err.details);
    });


});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});