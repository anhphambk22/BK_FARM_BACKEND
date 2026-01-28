import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const SYSTEM_PROMPT =
  'Bạn là trợ lý AI nông nghiệp của BK Farmers. ' +
  'Trả lời ngắn gọn, rõ ràng, thân thiện bằng tiếng Việt. ' +
  'Tập trung vào tư vấn canh tác, chăm sóc cây trồng, phân bón, tưới tiêu, sâu bệnh. ' +
  'Nếu thiếu dữ liệu cụ thể, hãy hỏi thêm 1-2 câu để làm rõ.';

router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body || {};

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'Thiếu GEMINI_API_KEY trên server.' });
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'messages không hợp lệ.' });
    }

    const contents = messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(msg.content || '') }],
    }));

    const model = process.env.GEMINI_MODEL.trim();
    const apiVersion = process.env.GEMINI_API_VERSION || 'v1beta';
    const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const body = {
      contents,
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 512,
      },
    };

    // Chỉ dùng systemInstruction cho v1beta, không thêm [SYSTEM] vào prompt
    if (apiVersion === 'v1beta') {
      body.systemInstruction = {
        role: 'system',
        parts: [{ text: SYSTEM_PROMPT }],
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (!response.ok) {
      const errMessage = data?.error?.message || 'Gemini API lỗi.';
      return res.status(500).json({ message: errMessage });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part?.text)
        .filter(Boolean)
        .join('') ||
      'Xin lỗi, tôi chưa có câu trả lời phù hợp lúc này.';

    return res.json({ reply });
  } catch (err) {
    console.error('Gemini chat error:', err);
    return res.status(500).json({ message: 'Lỗi server khi gọi Gemini.' });
  }
});

export default router;
