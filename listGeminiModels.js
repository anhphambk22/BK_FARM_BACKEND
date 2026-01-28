import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log('Available Gemini models:');
    if (data.models) {
      data.models.forEach(m => console.log(`- ${m.name}`));
    } else {
      console.log('No models found or API key invalid.');
      console.log(data);
    }
  })
  .catch(console.error);