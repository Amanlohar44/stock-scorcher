export const generateDailyContentPackage = async () => {
  const apiKey = import.meta.env.VITE_GCP_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("🚨 SYSTEM ERROR: API Key missing hai!");
  }

  const prompt = `
You are the Senior AI Marketing Architect for "Stock Scorcher", an elite stock market education platform in India founded by Aman Lohar.
Your goal is to generate a daily content marketing package.

TARGET AUDIENCE: Indian stock market beginners, traders, and investors.
TONE: Professional, educational, premium, trustworthy.

RULES:
- NEVER promise guaranteed returns.
- Focus on technical analysis, price action, risk management, and psychology.
- All content must be safe, accurate, and highly engaging.

Select a highly relevant, trending, or foundational stock market topic.

Then, generate a content package formatted as a STRICT JSON OBJECT with the following keys:

{
  "topic": "The main topic chosen",
  "qualityScore": 95,
  "blog": {
    "title": "SEO optimized blog title",
    "category": "e.g., Price Action, Psychology, Basics",
    "descriptionHtml": "Write a 500-word detailed article formatted in clean HTML (use <h2>, <p>, <ul>, <li>, <strong>). No markdown backticks."
  },
  "instagram": {
    "caption": "Engaging caption with emojis and #hashtags",
    "carouselSlides": [
      "Slide 1 text: Hook",
      "Slide 2 text: Point 1",
      "Slide 3 text: Point 2",
      "Slide 4 text: CTA"
    ]
  },
  "youtubeShort": {
    "title": "Catchy YouTube Short Title",
    "script": "A 45-second script. Include [Visual Hook], [Voiceover], [On-Screen Text]."
  },
  "telegram": {
    "message": "A concise, value-packed message for the Telegram channel with emojis and a call to read the blog."
  },
  "whatsapp": {
    "message": "A short, polite WhatsApp broadcast message for opted-in students."
  }
}

OUTPUT ONLY VALID JSON. Do not include any extra text before or after the JSON block.
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `🚨 GOOGLE SERVER ERROR: ${
          data.error?.message || "Unknown error"
        }`
      );
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("🚨 FORMAT ERROR: AI ne koi response nahi diya.");
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("🚨 FORMAT ERROR: AI ne valid JSON response nahi diya.");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Autopilot Error:", error);
    throw new Error(`🚀 V1 FINAL CODE ERROR: ${error.message}`);
  }
};