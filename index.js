const axios = require("axios");
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 10000;

const HF_API_KEY = process.env.HF_API_KEY; // Make sure this is set in Render

app.use(cors());
app.get("/ask", async (req, res) => {
  const prompt = req.query.prompt || "Hello";
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct",
      {
        inputs: prompt
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
