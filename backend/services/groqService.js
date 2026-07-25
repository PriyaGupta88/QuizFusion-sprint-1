import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
// Use a current Groq-hosted model. Swap the model string if Groq deprecates it.
const MODEL = "llama-3.3-70b-versatile";

/**
 * Strips markdown code fences etc. and parses JSON safely.
 */
function safeParseJSON(raw) {
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/```$/, "");
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // try to extract the first { ... } or [ ... ] block
    const match = cleaned.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error("AI did not return valid JSON: " + err.message);
  }
}

async function callGroq(systemPrompt, userPrompt, { json = true } = {}) {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    temperature: 0.6,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    ...(json ? { response_format: { type: "json_object" } } : {}),
  });
  return completion.choices[0].message.content;
}

/**
 * Generate a structured test using Groq.
 */
export async function generateQuestions({ subject, topic, difficulty, numQuestions, questionType }) {
  const systemPrompt = `You are an expert exam question writer. You always respond with ONLY valid JSON, no prose, no markdown fences.
The JSON must match this shape exactly:
{
  "questions": [
    {
      "questionText": string,
      "type": "mcq" | "coding" | "short" | "long" | "fill" | "truefalse",
      "options": string[] (only for mcq or truefalse, otherwise empty array),
      "correctAnswer": string,
      "explanation": string
    }
  ]
}`;

  const userPrompt = `Generate ${numQuestions} ${difficulty} difficulty questions about "${topic}" (subject: ${subject}).
Question type requested: ${questionType}. If "mixed" is requested, vary the "type" field across mcq, short, coding, truefalse.
For MCQ, provide exactly 4 options in "options" and put the correct option text in "correctAnswer".
For true/false, options should be ["True","False"].
For coding/short/long/fill, "options" should be an empty array and "correctAnswer" should hold the model answer.
Always include a short "explanation" for the correct answer.
Return ONLY the JSON object described in the system prompt.`;

  const raw = await callGroq(systemPrompt, userPrompt);
  const parsed = safeParseJSON(raw);
  if (!parsed.questions || !Array.isArray(parsed.questions)) {
    throw new Error("AI response missing 'questions' array");
  }
  return parsed.questions;
}

/**
 * Evaluate descriptive (short/long/coding) answers with Groq.
 */
export async function evaluateAnswers({ questions, answers }) {
  const systemPrompt = `You are an expert exam grader. You always respond with ONLY valid JSON, no prose.
The JSON must match:
{
  "evaluations": [
    {
      "questionIndex": number,
      "isCorrect": boolean,
      "score": number (0-100),
      "feedback": string,
      "mistakes": string,
      "suggestion": string
    }
  ],
  "summary": string,
  "recommendations": string[]
}`;

  const userPrompt = `Grade the following answers against the questions and model/correct answers.
Be fair but rigorous. For MCQ/true-false, isCorrect is a simple exact match; score is 100 or 0.
For descriptive/coding answers, grade for correctness and completeness, give partial credit (0-100), explain mistakes, and suggest how to improve.
Also produce an overall "summary" (2-3 sentences) and 3-5 "recommendations" (topics/resources to revisit) for the whole test.

DATA:
${JSON.stringify({ questions, answers })}

Return ONLY the JSON object described in the system prompt.`;

  const raw = await callGroq(systemPrompt, userPrompt);
  return safeParseJSON(raw);
}

/**
 * Floating AI learning assistant chat (free-form, markdown allowed, not forced JSON).
 */
export async function chatAssistant({ history, message, testContext }) {
  const systemPrompt = `You are an encouraging, knowledgeable AI learning assistant embedded in a test-prep platform.
You help students understand concepts, solve coding problems, explain mistakes, give hints (not full answers unless asked directly), and suggest learning resources.
Respond in Markdown. Use fenced code blocks with language tags for any code.
${testContext ? `The student is currently working on a test about: ${testContext}. Use this as context when relevant.` : ""}
Keep answers focused and not overly long unless the student asks for depth.`;

  const completion = await groq.chat.completions.create({
    model: MODEL,
    temperature: 0.7,
    messages: [
      { role: "system", content: systemPrompt },
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: message },
    ],
  });
  return completion.choices[0].message.content;
}

/**
 * Personalized recommendations based on past performance.
 */
export async function generateRecommendations({ weakTopics, strongTopics, recentScores }) {
  const systemPrompt = `You are an academic advisor AI. Respond with ONLY valid JSON:
{
  "nextTopics": string[],
  "weakConcepts": string[],
  "dailyPlan": string[],
  "revisionPlan": string[]
}`;
  const userPrompt = `Student weak topics: ${JSON.stringify(weakTopics)}.
Strong topics: ${JSON.stringify(strongTopics)}.
Recent scores (%): ${JSON.stringify(recentScores)}.
Suggest a concise, personalized study plan. Return ONLY the JSON object.`;

  const raw = await callGroq(systemPrompt, userPrompt);
  return safeParseJSON(raw);
}
