import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY as string;

export const genAI = new GoogleGenAI({ apiKey });

export const GEMINI_MODEL = "gemini-2.5-flash";