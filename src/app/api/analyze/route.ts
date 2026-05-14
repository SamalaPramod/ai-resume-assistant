import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function GET() {
  try {

    const chatCompletion =
      await client.chat.completions.create({

        messages: [
          {
            role: "user",
            content: "Say Groq AI connected successfully",
          },
        ],

        model: "llama-3.1-8b-instant",
      });

    return Response.json({
      result:
        chatCompletion.choices[0].message.content,
    });

  } catch (error: any) {

    console.log(error);

    return Response.json({
      error: error.message,
    });
  }
}