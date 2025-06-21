const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/ask", async (req, res) => {
  const prompt = req.query.prompt || "Hello";

  try {
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    const reply = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) {
      console.log("⚠️ Empty reply from Gemini");
      return res.json({ reply: "⚠️ Gemini gave no reply." });
    }

    res.json({ reply });
  } catch (err) {
    console.error("❌ Gemini Error:", err.response?.data || err.message);
    res.json({ reply: "⚠️ Gemini error: " + (err.response?.data?.error?.message || err.message) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
