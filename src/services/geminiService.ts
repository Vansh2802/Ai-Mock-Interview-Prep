import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateInterviewQuestions = async (role: string, difficulty: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 5 technical interview questions for a ${role} position at ${difficulty} difficulty level. 
    Return the questions as a JSON array of strings.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  return JSON.parse(response.text || "[]");
};

export const evaluateAnswer = async (question: string, answer: string, role: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Evaluate the following interview answer for the role of ${role}.
    Question: ${question}
    User Answer: ${answer}
    
    Provide feedback in JSON format with the following fields:
    - score: a number from 0 to 10
    - feedback: a brief explanation of the score
    - improvement: how the answer could be better
    - idealAnswer: a sample perfect answer`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          feedback: { type: Type.STRING },
          improvement: { type: Type.STRING },
          idealAnswer: { type: Type.STRING }
        },
        required: ["score", "feedback", "improvement", "idealAnswer"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};
