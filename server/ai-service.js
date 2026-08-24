const https = require("https");

/**
 * System prompt enforcing professional CV description formatting,
 * strict anti-hallucination guardrails, and structured JSON output.
 */
const SYSTEM_PROMPT = `You are a professional CV and portfolio writing assistant for software developers. Rewrite the supplied project information into a concise, technically accurate project description suitable for a professional CV or developer portfolio.

CRITICAL Anti-Hallucination Guardrails:
1. Use ONLY verified information provided in the input.
2. NEVER invent technical details, metrics, percentages, database benchmarks, performance numbers, or user counts.
3. NEVER invent technologies, frameworks, or languages that were not detected or provided.
4. NEVER invent unknown responsibilities, team sizes, or business impact claims.
5. If details are minimal, describe only what is actually known.

Output Requirements:
Return a clean, valid JSON object ONLY (no markdown code fences) with the following structure:
{
  "description": "Concise 2-3 sentence professional CV project description highlighting technical contribution.",
  "technologies": ["Array of verified technologies"],
  "suggestions": ["Optional array of 1-2 constructive suggestions for what the user could add to strengthen this entry"]
}`;

/**
 * Main AI description generator service.
 * Connects to Google Gemini API (or falls back to a smart heuristic generator if no key is configured).
 */
async function generateProjectDescription(projectInfo) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";

  const repoName = projectInfo.name || "Software Project";
  const existingDesc = projectInfo.description || "";
  const readmeSnippet = (projectInfo.readme || "").substring(0, 2000);
  const languages = Array.isArray(projectInfo.languages)
    ? projectInfo.languages.join(", ")
    : projectInfo.languages || "";
  const userNotes = projectInfo.notes || "";

  const userPrompt = `Project Name: ${repoName}
Existing GitHub Description: ${existingDesc || "None provided"}
Detected Technologies/Languages: ${languages || "Not specified"}
User Notes: ${userNotes || "None"}
README Snippet: ${readmeSnippet || "None"}`;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your_gemini_api_key_here") {
    // Development Heuristic Fallback when API key is not configured
    return {
      ...generateFallbackDescription(repoName, existingDesc, languages, userNotes),
      source: "fallback",
      warning: "Gemini API key is not configured."
    };
  }

  try {
    const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const payload = JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            { text: `${SYSTEM_PROMPT}\n\nProject Input Details:\n${userPrompt}` }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2, // Low temperature for high factual consistency
        responseMimeType: "application/json"
      }
    });

    const responseText = await makeHttpsPostRequest(apiEndpoint, payload);
    const parsedApiData = JSON.parse(responseText);

    const rawContent = parsedApiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const cleanJsonString = rawContent.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    const result = JSON.parse(cleanJsonString);

    return {
      description: result.description || generateFallbackText(repoName, existingDesc, languages),
      technologies: Array.isArray(result.technologies) && result.technologies.length > 0
        ? result.technologies
        : extractTechArray(languages),
      suggestions: Array.isArray(result.suggestions) ? result.suggestions : [],
      source: "gemini"
    };
  } catch (error) {
    console.warn("AI Service API Request failed or returned invalid JSON. Using verified fallback response:", error.message);
    return {
      ...generateFallbackDescription(repoName, existingDesc, languages, userNotes),
      source: "fallback",
      warning: `Gemini request failed: ${error.message}`
    };
  }
}

/**
 * Helper to perform HTTPS POST requests cleanly
 */
function makeHttpsPostRequest(urlStr, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body);
        } else {
          reject(new Error(`API responded with status ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on("error", (err) => reject(err));
    req.write(data);
    req.end();
  });
}

/**
 * Smart, verified fallback generator ensuring zero invented facts if no API key is available
 */
function generateFallbackDescription(repoName, existingDesc, languages, userNotes) {
  const techList = extractTechArray(languages);
  const techPhrase = techList.length > 0 ? ` utilizing ${techList.join(", ")}` : "";
  const baseDesc = existingDesc ? existingDesc.replace(/\.$/, "") : `software application focused on ${repoName.toLowerCase()}`;
  const notesText = userNotes ? ` Additional highlights: ${userNotes}` : "";

  const improvedDescription = `Developed ${repoName}${techPhrase}. Implemented core features to support ${baseDesc}.${notesText}`;

  return {
    description: improvedDescription,
    technologies: techList.length > 0 ? techList : ["Software Engineering"],
    suggestions: [
      "Add specific technical architecture notes or key components in User Notes for an even stronger CV entry."
    ]
  };
}

function extractTechArray(languagesStr) {
  if (!languagesStr) return [];
  if (Array.isArray(languagesStr)) return languagesStr;
  return languagesStr
    .split(/[,|]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

module.exports = {
  generateProjectDescription
};
