import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  const musicDir = path.join(__dirname, "music");
  if (!fs.existsSync(musicDir)) {
    fs.mkdirSync(musicDir);
  }

  // API to list tracks
  app.get("/api/tracks", (req, res) => {
    try {
      const files = fs.readdirSync(musicDir);
      const audioExtensions = [".mp3", ".wav", ".opus", ".flac", ".m4a"];
      const imageExtensions = [".jpg", ".jpeg", ".png", ".webp"];

      const tracks = files
        .filter((file) => audioExtensions.includes(path.extname(file).toLowerCase()))
        .map((file) => {
          const name = path.parse(file).name;
          const ext = path.extname(file);
          
          // Find matching thumbnail
          const thumbnail = files.find((f) => {
            const fName = path.parse(f).name;
            const fExt = path.extname(f).toLowerCase();
            return fName === name && imageExtensions.includes(fExt);
          });

          return {
            id: name,
            title: name,
            url: `/music/${file}`,
            thumbnail: thumbnail ? `/music/${thumbnail}` : "https://picsum.photos/seed/music/400/400",
          };
        });

      res.json(tracks);
    } catch (error) {
      res.status(500).json({ error: "Failed to list tracks" });
    }
  });

  // Serve music folder
  app.use("/music", express.static(musicDir));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
