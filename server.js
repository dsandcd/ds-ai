
require("dotenv").config();

const express = require("express");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const ai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/api/health", (req, res) => {
  res.json({ status: "DS AI is ready!" });
});

app.post("/api/chat", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        error: "API Key එක තවම සකස් කර නැහැ."
      });
    }

    const messages = Array.isArray(req.body.messages)
      ? req.body.messages.slice(-20)
      : [];

    const response = await ai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-6-astra",
      instructions:
        "ඔබ DS AI නම් සිංහල AI සහායකයෙකි. හැකි සෑම විටම පැහැදිලි සිංහලෙන් පිළිතුරු දෙන්න.",
      input: messages.map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || "").slice(0, 4000)
      }))
    });

    res.json({
      reply: response.output_text || "පිළිතුරක් ලැබුණේ නැහැ."
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "දෝෂයක් ඇතිවුණා. නැවත උත්සාහ කරන්න."
    });
  }
});

app.listen(PORT, () => {
  console.log("DS AI started on port " + PORT);
});
