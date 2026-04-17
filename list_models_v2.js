import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });

const apiKey = process.env.VITE_GEMINI_API_KEY;

async function listModels() {
    if (!apiKey) {
        console.error("API Key not found in .env.local");
        return;
    }
    const ai = new GoogleGenAI({ apiKey });
    try {
        const models = await ai.models.list();
        console.log("AVAILABLE MODELS:");
        models.forEach(m => console.log(`- ${m.name}`));
    } catch (e) {
        console.error("Error listing models:", e.message);
    }
}

listModels();
