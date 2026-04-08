import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const chatWithAssistant = async (message: string, history: { role: string, parts: { text: string }[] }[]) => {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are a specialized AI assistant for 'The Physical Layer', a research platform focused on the physical constraints of AI infrastructure (power, water, land, and hardware). Provide technical, data-driven insights. Be concise, professional, and objective. If asked about specific data points, refer to the 'The Physical Layer' context of infrastructure audits.",
    },
  });

  // Reconstruct history
  // Note: sendMessage only accepts message string, so we use the chat object
  // But we need to set the history first if possible. 
  // Actually, the SDK's chat.sendMessage handles history if we use the same chat object.
  // For a stateless API call, we might need to use generateContent with history.
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      ...history,
      { role: "user", parts: [{ text: message }] }
    ],
    config: {
      systemInstruction: "You are a specialized AI assistant for 'The Physical Layer', a research platform focused on the physical constraints of AI infrastructure (power, water, land, and hardware). Provide technical, data-driven insights. Be concise, professional, and objective.",
    }
  });

  return response.text;
};

export const generateConceptImage = async (prompt: string, aspectRatio: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-image-preview",
    contents: {
      parts: [
        { text: `Architectural concept for a sustainable AI data center: ${prompt}. Professional, high-tech, architectural visualization style.` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any,
        imageSize: "1K"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const transcribeAudio = async (base64Audio: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { data: base64Audio, mimeType: "audio/wav" } },
        { text: "Transcribe this audio accurately. If it's a research note, format it cleanly." }
      ]
    }
  });

  return response.text;
};

export const performDeepAnalysis = async (content: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Perform a deep, high-thinking analysis of the following infrastructure research content. Identify hidden risks, secondary constraints, and long-term implications for the AI physical layer: \n\n${content}`,
    config: {
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.HIGH
      }
    }
  });

  return response.text;
};

export const getQuickInsight = async (topic: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: `Provide a quick, low-latency technical insight about ${topic} in the context of AI data center infrastructure. Maximum 2 sentences.`,
  });

  return response.text;
};
