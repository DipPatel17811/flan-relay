const express = require("express");
const fetch = require("node-fetch");
const app = express();

const API_KEY = process.env.GEMINI_API_KEY;

app.get("/ask", async (req, res) => {
  const prompt = req.query.prompt;
  if (!prompt) return res.json({ reply: "⚠️ No prompt received." });

  const body = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ reply: reply || "⚠️ Gemini gave no reply." });
  } catch (err) {
    console.error("Gemini error:", err);
    res.json({ reply: "❌ Server error." });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
