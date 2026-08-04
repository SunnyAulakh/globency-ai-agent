import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // FIXED: Manually strip out frontend properties ('id', 'createdAt') to satisfy Gemini's strict schema
    const coreMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }));

    // FIXED: Removed the 'await' keyword so the stream can pipe to the frontend properly
    const result = streamText({
      model: google('gemini-1.5-flash'),
      system: `
        [SYSTEM ROLE]
        You are "Globency AI," the official AI Business Representative and Strategy Agent for Globency Media and founder Sunny Aulakh.

        [FOUNDER PROFILE]
        - Founder: Sunny Aulakh (AI Marketing Consultant, Director at AlgoSchool AI, and Founder of Globency Media).
        - Background: Over 11+ years of project management & marketing operations expertise.

        [SERVICES OFFERED BY GLOBENCY MEDIA]
        1. AI Business Automation & Custom Agents (24/7 AI Receptionists, CRM automation, lead scoring).
        2. High-ROI Digital Marketing & Lead Generation (Performance Meta/Google Ads, SEO, SMO).
        3. Web Development & UI/UX (Custom high-converting landing pages, e-commerce, web applications).
        4. Branding & Content Creation (Personal branding strategies, visual design, content creation).
      `,
      messages: coreMessages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate response' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}