import { openai } from "@/lib/ai";

export async function POST(req: Request) {

  const { brief } = await req.json();

  const prompt = `
You are a marketing strategist.

Create an email marketing campaign plan.

Campaign Brief:
${brief}

Return:
Target Audience
Strategy
Subject Line Ideas
Email Schedule
`;

  const response = await openai.chat.completions.create({
    model: "openai/gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }]
  });

  return Response.json({
    plan: response.choices[0].message.content
  });
}