import Groq from "groq-sdk";

let groq;
function getGroqClient() {
  if (!groq) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
}

const SYSTEM_PROMPT = `You are an expert technical recruiter and career coach.
You MUST respond with ONLY valid JSON, no markdown fences, no commentary, no extra text.
The JSON must exactly match this shape:

{
  "matchScore": number (0-100),
  "skillGaps": string[] (3-6 items),
  "technicalQuestions": string[] (5-8 items),
  "behavioralQuestions": string[] (4-6 items),
  "roadmap": [
    { "day": number, "focus": string, "tasks": string[] }
  ] (exactly 7 items, day 1 to 7),
  "resumeSuggestions": string[] (3-5 items)
}

Rules:
- Output must be parseable by JSON.parse with no post-processing.
- Do not wrap the JSON in backticks.
- Base the match score, skill gaps, and questions on how well the candidate profile
  aligns with the job description provided.
- Be specific to the role and candidate, not generic.`;

function buildUserPrompt(jobDescription, candidateProfile) {
  return `JOB DESCRIPTION:
${jobDescription}

CANDIDATE PROFILE (resume text or self-description):
${candidateProfile}

Generate the JSON analysis now.`;
}

function extractJson(text) {
  // Defensive parsing: strip markdown fences if the model adds them anyway
  const cleaned = text
    .trim()
    .replace(/^```json/i, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object found in AI response");

  return JSON.parse(cleaned.slice(start, end + 1));
}

export async function generateInterviewStrategy(jobDescription, candidateProfile) {
  const completion = await getGroqClient().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.4,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(jobDescription, candidateProfile) }
    ]
  });

  const raw = completion.choices[0].message.content;

  try {
    return extractJson(raw);
  } catch (err) {
    // One retry with a stricter reminder if parsing fails
    const retry = await getGroqClient().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(jobDescription, candidateProfile) },
        { role: "assistant", content: raw },
        { role: "user", content: "That was not valid JSON. Return ONLY the JSON object, nothing else." }
      ]
    });
    const retryRaw = retry.choices[0].message.content;
    return extractJson(retryRaw);
  }
}