import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: any, res: any) {
  // -----------------------------
  // Method guard
  // -----------------------------
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { auditText } = req.body;

    // -----------------------------
    // Input validation
    // -----------------------------
    if (!auditText || typeof auditText !== "string") {
      return res.status(400).json({
        error: "auditText is required and must be a string",
      });
    }

    // -----------------------------
    // Strict prompt (hackathon-safe)
    // -----------------------------
    const prompt = `
You are a blockchain security assistant.

Return ONLY valid JSON. Do NOT include markdown, explanations, or extra text.

Use this schema exactly:

{
  "riskLevel": "LOW | MEDIUM | HIGH",
  "executiveSummary": string,
  "keyFindings": string[],
  "recommendations": string[]
}

Rules:
- Do NOT hallucinate vulnerabilities.
- Only infer from provided text.
- If unclear, state "insufficient data" in summary.

Input:
${auditText}
`;

    // -----------------------------
    // OpenAI call (stable model)
    // -----------------------------
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
      temperature: 0.3,
    });

    const outputText = response.output_text;

    // -----------------------------
    // Defensive JSON parsing
    // -----------------------------
    let parsed;

    try {
      parsed = JSON.parse(outputText);
    } catch (err) {
      return res.status(500).json({
        error: "AI returned invalid JSON",
        raw: outputText,
      });
    }

    // -----------------------------
    // Success response
    // -----------------------------
    return res.status(200).json(parsed);
  } catch (error) {
    console.error("Audit summary error:", error);

    return res.status(500).json({
      error: "Failed to generate audit summary",
    });
  }
}