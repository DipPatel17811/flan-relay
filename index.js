const axios = require("axios");
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 10000;

const HF_API_KEY = process.env.HF_API_KEY;

app.use(cors());

app.get("/ask", async (req, res) => {
  const prompt = req.query.prompt || "Hello";

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/google/flan-t5-base",
      {
        inputs: prompt,
        options: { wait_for_model: true }
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data?.[0]?.generated_text || "⚠️ No reply.";
    res.json({ reply });
  } catch (err) {
    console.error("❌ Hugging Face Error:", err.response?.data || err.message);
    res.json({
      reply: "⚠️ HF error: " + (err.response?.data?.error || err.message)
    });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
