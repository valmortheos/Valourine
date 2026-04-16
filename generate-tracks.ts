import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const musicDir = path.join(__dirname, 'music');
const publicMusicDir = path.join(__dirname, 'public', 'music');

// Ensure directories exist
if (!fs.existsSync(path.join(__dirname, 'public'))) {
  fs.mkdirSync(path.join(__dirname, 'public'), { recursive: true });
}
if (!fs.existsSync(publicMusicDir)) {
  fs.mkdirSync(publicMusicDir, { recursive: true });
}

// Copy music files to public for static hosting
if (fs.existsSync(musicDir)) {
  const files = fs.readdirSync(musicDir);
  console.log(`Found ${files.length} items in source music/ folder`);
  files.forEach(file => {
    try {
      fs.copyFileSync(path.join(musicDir, file), path.join(publicMusicDir, file));
    } catch (e) {
      console.error(`Failed to copy ${file}`, e);
    }
  });
}

const audioExtensions = ['.mp3', '.wav', '.opus', '.flac', '.m4a', '.mp4', '.ogg'];
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

const files = fs.existsSync(publicMusicDir) ? fs.readdirSync(publicMusicDir) : [];
console.log(`Found ${files.length} files in public/music`);

const tracks = files
  .filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return audioExtensions.includes(ext);
  })
  .map((file) => {
    const name = path.parse(file).name;
    
    // Case-insensitive search for thumbnail
    const thumbnail = files.find((f) => {
      const fName = path.parse(f).name;
      const fExt = path.extname(f).toLowerCase();
      return fName.toLowerCase() === name.toLowerCase() && imageExtensions.includes(fExt);
    });

    console.log(`Mapping track: ${name} (Thumbnail: ${thumbnail || 'none'})`);

    return {
      id: name,
      title: name,
      url: `./music/${file}`,
      thumbnail: thumbnail ? `./music/${thumbnail}` : `https://picsum.photos/seed/${encodeURIComponent(name)}/400/400`,
    };
  });

fs.writeFileSync(
  path.join(__dirname, 'public', 'tracks.json'),
  JSON.stringify(tracks, null, 2)
);

console.log('Generated tracks.json for static hosting');
