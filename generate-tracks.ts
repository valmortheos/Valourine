import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const musicDir = path.join(__dirname, 'music');
const publicMusicDir = path.join(__dirname, 'public', 'music');

// Ensure public/music exists
if (!fs.existsSync(publicMusicDir)) {
  fs.mkdirSync(publicMusicDir, { recursive: true });
}

// Copy music files to public for static hosting
if (fs.existsSync(musicDir)) {
  const files = fs.readdirSync(musicDir);
  files.forEach(file => {
    fs.copyFileSync(path.join(musicDir, file), path.join(publicMusicDir, file));
  });
}

const audioExtensions = ['.mp3', '.wav', '.opus', '.flac', '.m4a'];
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

const files = fs.existsSync(publicMusicDir) ? fs.readdirSync(publicMusicDir) : [];

const tracks = files
  .filter((file) => audioExtensions.includes(path.extname(file).toLowerCase()))
  .map((file) => {
    const name = path.parse(file).name;
    
    const thumbnail = files.find((f) => {
      const fName = path.parse(f).name;
      const fExt = path.extname(f).toLowerCase();
      return fName === name && imageExtensions.includes(fExt);
    });

    return {
      id: name,
      title: name,
      url: `./music/${file}`,
      thumbnail: thumbnail ? `./music/${thumbnail}` : "https://picsum.photos/seed/music/400/400",
    };
  });

fs.writeFileSync(
  path.join(__dirname, 'public', 'tracks.json'),
  JSON.stringify(tracks, null, 2)
);

console.log('Generated tracks.json for static hosting');
