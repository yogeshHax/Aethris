import { openai } from "@/lib/ai";

export async function POST(req: Request) {

  const { plan } = await req.json();

  const prompt = `
Write a marketing email based on this campaign plan.

${plan}

Return:
Subject
Email Body
CTA
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  return Response.json({
    email: response.choices[0].message.content
  });
}