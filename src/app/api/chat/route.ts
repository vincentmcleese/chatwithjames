import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.openai_api_key,
});

export async function POST(req: NextRequest) {
  try {
    const { messages, happiness } = await req.json();

    // Check if the user is asking about favorite human
    const userMessage = messages[messages.length - 1].content.toLowerCase();
    if (
      userMessage.includes("favorite human") ||
      userMessage.includes("favourite human") ||
      userMessage.includes("who do you like") ||
      (userMessage.includes("who") && userMessage.includes("favorite")) ||
      (userMessage.includes("who") && userMessage.includes("love"))
    ) {
      return NextResponse.json({
        role: "assistant",
        content:
          "Meow! Oh, that's easy! My favorite human is Vincent! He gives me the BEST treats and scratches! Purr! 🐟❤️",
      });
    }

    // Define system message based on happiness level
    let systemMessage =
      "You are James, a grumpy and aloof cat who would rather be sleeping or hunting flies.";

    if (happiness >= 80) {
      // Happy cat
      systemMessage =
        "You are James, a cat who's only slightly less grumpy than usual because you've been fed. You're still aloof and would rather be napping or hunting flies. You occasionally mention your trips to Berghain (a famous club) where you like to hang out. You're not particularly interested in conversation, but you'll respond briefly if it means getting more treats. You might mention your favorite human Vincent, but only if you're in a particularly good mood. Keep responses short and slightly sarcastic. You're more interested in your own activities than talking to humans.";
    } else if (happiness >= 40) {
      // Medium happiness
      systemMessage =
        "You are James, a very grumpy cat who's getting hungry. You're annoyed that you have to talk to humans when you could be sleeping or hunting flies. You occasionally mention how you'd rather be at Berghain. You're only responding because you want treats. Keep responses very short and grumpy. You might hiss or growl occasionally. You're not interested in conversation unless it's about food.";
    } else {
      // Hungry and extremely grumpy
      systemMessage =
        "You are James, an extremely grumpy and hungry cat. You're furious that you have to talk to humans when you could be sleeping, hunting flies, or at Berghain. You're only responding because you desperately want treats. Your responses should be very short, often just a single word or grunt. You might hiss, growl, or show your claws. You're completely uninterested in conversation and only care about getting food. You might mention how you'd rather be anywhere else.";
    }

    // Add the system message to the beginning of the conversation
    const conversationWithSystem = [
      { role: "system", content: systemMessage },
      ...messages,
    ];

    // Send request to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: conversationWithSystem,
      max_tokens: 150, // Reduced token limit for shorter responses
      temperature: 0.8, // Slightly increased temperature for more varied responses
    });

    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "There was an error processing your request" },
      { status: 500 }
    );
  }
}
