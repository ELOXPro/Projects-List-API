const http = require("http");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const port = 3000;

async function getProjects() {
  try {
    await client.connect();
    const db = client.db("main");
    const collection = db.collection("Project");
    return await collection.find().toArray();
  } catch (err) {
    console.error("DB error:", err);
    return [];
  }
}

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS request
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  // Handle API route
  if (req.url === "/api/projects" && req.method === "GET") {
    const projects = await getProjects();
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(projects));
  }

  // Fallback for unmatched routes
  res.writeHead(404);
  res.end("Not Found");
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
