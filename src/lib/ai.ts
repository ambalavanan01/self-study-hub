import type { Semester } from './cgpa';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const SITE_URL = window.location.origin;
const SITE_NAME = 'StudyTrack';

interface AIResponse {
    content: string;
    reasoning_details?: any;
}

async function callOpenRouter(messages: any[], model: string = "openai/gpt-oss-20b:free"): Promise<AIResponse> {
    if (!OPENROUTER_API_KEY) {
        throw new Error("OpenRouter API Key is missing. Please set VITE_OPENROUTER_API_KEY in your environment variables.");
    }

    try {
        console.log("Calling OpenRouter with model:", model);
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "HTTP-Referer": SITE_URL,
                "X-Title": SITE_NAME,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": model,
                "messages": messages,
                // "reasoning": { "enabled": true } // specific to some providers, keeping it simple for now unless requested for specific models
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("OpenRouter API Error:", response.status, errorData);
            throw new Error(`API Error (${response.status}): ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return {
            content: data.choices[0].message.content,
            reasoning_details: data.choices[0].message.reasoning_details
        };
    } catch (error) {
        console.error("AI Service Error:", error);
        throw error;
    }
}

export async function analyzeCGPA(semesters: Semester[], currentCGPA: number): Promise<string> {
    const prompt = `
    I am a student with a current CGPA of ${currentCGPA.toFixed(2)}.
    Here is my academic history:
    ${JSON.stringify(semesters, null, 2)}
    
    Please analyze my performance. Identify my strong and weak subjects/semesters.
    Give me specific, actionable advice on how to improve my CGPA.
    Be encouraging but realistic. Keep it concise (under 300 words).
    `;

    const response = await callOpenRouter([
        { role: "system", content: "You are an academic advisor AI." },
        { role: "user", content: prompt }
    ]);

    return response.content;
}

export async function getFutureTrends(interests: string[]): Promise<string> {
    if (interests.length === 0) {
        return "Please add some interests to get personalized future trends.";
    }

    const prompt = `
    My interests are: ${interests.join(", ")}.
    
    Provide a daily update on future trends related to these topics.
    Focus on emerging technologies, career opportunities, or major shifts in these fields.
    Keep it relevant for a student.
    Format it as a short "Daily Briefing" with bullet points.
    `;

    const response = await callOpenRouter([
        { role: "system", content: "You are a tech trend analyst AI." },
        { role: "user", content: prompt }
    ]);

    return response.content;
}

export async function getStudyGuide(topic: string): Promise<string> {
    const prompt = `
    I want to study: "${topic}".
    
    Create a comprehensive study guide for this topic.
    Include:
    1. Key Concepts to Master
    2. Recommended Learning Path (Beginner to Advanced)
    3. Practical Projects or Exercises
    4. Resources (types of resources to look for)
    
    Format with Markdown.
    `;

    const response = await callOpenRouter([
        { role: "system", content: "You are an expert tutor AI." },
        { role: "user", content: prompt }
    ]);

    return response.content;
}
