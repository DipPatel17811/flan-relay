const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/ask", async (req, res) => {
  const prompt = req.query.prompt || "Hello";

  try {
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta2/models/chat-bison-001:generateMessage?key=${process.env.GEMINI_API_KEY}`,
      {
        prompt: {
          messages: [
            {
              author: "user",
              content: prompt
            }
          ]
        }
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    const reply = geminiRes.data?.candidates?.[0]?.content || "⚠️ Gemini gave no reply.";
    res.json({ reply });
  } catch (err) {
    console.error("❌ Gemini Error:", err.response?.data || err.message);
    res.json({
      reply:
        "⚠️ Gemini error: " +
        (err.response?.data?.error?.message || err.message)
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
