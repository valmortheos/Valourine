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

  const root = process.cwd();
  const musicDir = path.join(root, "music");
  const thumbDir = path.join(root, "musict");
  const metadataPath = path.join(root, "music-metadata.json");

  // Ensure directories exist
  [musicDir, thumbDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  // API to list tracks
  app.get("/api/tracks", (req, res) => {
    try {
      let metadata: any = { tracks: [] };
      if (fs.existsSync(metadataPath)) {
        metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
      }

      const files = fs.readdirSync(musicDir);
      const audioExtensions = [".mp3", ".wav", ".opus", ".flac", ".m4a"];
      
      const tracks = files
        .filter((file) => audioExtensions.includes(path.extname(file).toLowerCase()))
        .map((file) => {
          const fileName = file;
          const nameOnly = path.parse(file).name;
          
          // Check if metadata exists for this file
          const meta = metadata.tracks?.find((m: any) => m.filename === fileName);
          
          let thumbnail = meta?.thumbnail 
            ? `/musict/${meta.thumbnail}` 
            : null;

          // Auto-find thumbnail if not in meta
          if (!thumbnail && fs.existsSync(thumbDir)) {
            const thumbFiles = fs.readdirSync(thumbDir);
            const found = thumbFiles.find(f => path.parse(f).name === nameOnly);
            if (found) thumbnail = `/musict/${found}`;
          }

          return {
            id: nameOnly,
            title: meta?.title || nameOnly,
            genre: meta?.genre || "Unknown",
            url: `/music/${file}`,
            thumbnail: thumbnail || `https://picsum.photos/seed/${encodeURIComponent(nameOnly)}/400/400`,
          };
        });

      res.json(tracks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to list tracks" });
    }
  });

  // API for genres
  app.get("/api/genres", (req, res) => {
    try {
      if (fs.existsSync(metadataPath)) {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
        return res.json(metadata.genres || []);
      }
      res.json(["Pop", "Country", "EDM", "Techno", "Ambient", "Jazz"]);
    } catch (e) {
      res.json(["Pop", "Country", "EDM", "Techno", "Ambient", "Jazz"]);
    }
  });

  // Serve folders
  app.use("/music", express.static(musicDir));
  app.use("/musict", express.static(thumbDir));

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
