const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

const HF_API_KEY = process.env.HF_API_KEY;

app.use(cors());

app.get("/ask", async (req, res) => {
  const prompt = req.query.prompt || "Hello";
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/google/flan-t5-base",
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data?.[0]?.generated_text || "⚠️ No reply";
    res.json({ reply });
  } catch (error) {
    res.json({ reply: `⚠️ Gemini error: ${error.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
