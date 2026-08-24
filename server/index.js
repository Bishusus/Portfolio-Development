const http = require("http");
const fs = require("fs");
const path = require("path");

// Load .env file manually if present
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const parts = trimmed.split("=");
      const key = parts[0].trim();
      const val = parts.slice(1).join("=").trim();
      if (key && !process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

const { generateProjectDescription } = require("./ai-service");

const PORT = process.env.PORT || 3001;

const server = http.createServer(async (req, res) => {
  // CORS Headers for client interaction
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check endpoint
  if (req.method === "GET" && req.url === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", service: "DevEngine AI Project Assistant" }));
    return;
  }

  // AI Description Generator Endpoint
  if (req.method === "POST" && req.url === "/api/ai/improve-description") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const payload = JSON.parse(body || "{}");
        const { name, description, readme, languages, notes } = payload;

        if (!name || typeof name !== "string" || name.trim() === "") {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, error: "Project name is required." }));
          return;
        }

        const projectInfo = {
          name: name.trim().substring(0, 150),
          description: typeof description === "string" ? description.trim().substring(0, 1000) : "",
          readme: typeof readme === "string" ? readme.trim().substring(0, 2500) : "",
          languages: Array.isArray(languages)
            ? languages.map((l) => String(l).substring(0, 50))
            : typeof languages === "string"
            ? languages.substring(0, 200)
            : "",
          notes: typeof notes === "string" ? notes.trim().substring(0, 500) : ""
        };

        const aiResult = await generateProjectDescription(projectInfo);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, data: aiResult }));
      } catch (err) {
        console.error("Error handling /api/ai/improve-description:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: err.message || "AI service error." }));
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Endpoint not found" }));
});

server.listen(PORT, () => {
  console.log(`DevEngine AI Backend Server running on http://localhost:${PORT}`);
});
