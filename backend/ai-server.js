// ai-server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

const app = express();
const PORT = 3031;

app.use(cors());
app.use(bodyParser.json());

// ✅ New OpenAI client (latest SDK)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// AI Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // ✅ latest method (not old .create)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful AI Tax Assistant." },
        { role: "user", content: message },
      ],
      max_tokens: 500,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("❌ Error in /api/chat:", error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ AI Chat server running on http://localhost:${PORT}`);
});
