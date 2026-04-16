// This is a dummy small audio file (1 second silent) in base64 to test the player
// Real MP3 would be binary, but since I cannot upload binary directly, I use a valid small sample.
// You should replace these with your actual music files.
import fs from 'fs';
import path from 'path';

const dummyMp3Base64 = "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZWY1OC43Ni4xMDABAAAAAAAAAAAA//uQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACQAAICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA//8AAABhTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//uQZAAAK8A0S0AAAiYBkloAAAiU6vYvVvUAAAA0gAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//uQZAAK6AyK0AAAiX8BlJIAAiUt/kXUAAAi8vT/AAAF5f8AAAAAAAAAAAAAA/+5BkAIAr6DMLQAAAiIAHygAACKy3rS89S8v8AAAPy9S9S///7kGQAiCywNIdAAAIsAAYKAAAIrLen7y89S9S8vUgA///uQZACMMeDNPQAAAi8AAwoAAAi97pS9U/T9P0/T8vUP0/UgAP/7kGQAsDKA000AAAiyAAMKAAAIv/P//P8vT8vUP0/T///8v8vUgA///uQZACMMADTTQAACHmAAwoAAAi+8vXl/8vL16l/////////+v////6lIAP/7kGQAjDFgzTsAAAIl8AAwoAAAi//z9vL7+X/////X/////+X///6kIAP/7kGQAcC8gxN8AAAAp4BjD4AAAidmNnZ2Yv5X/////////9////f//X/////////+v/////UgE=";

const musicDir = './music';
if (!fs.existsSync(musicDir)) {
  fs.mkdirSync(musicDir);
}

// Create 2 dummy files
const dummyFiles = [
  { name: 'Moonlight Sonata.mp3', thumb: 'https://picsum.photos/seed/moonlight/800/800' },
  { name: 'Summer Vibes.wav', thumb: 'https://picsum.photos/seed/summer/800/800' }
];

dummyFiles.forEach(async (file) => {
  const filePath = path.join(musicDir, file.name);
  fs.writeFileSync(filePath, Buffer.from(dummyMp3Base64, 'base64'));
  
  // Create a placeholder thumbnail as well to test the matcher
  const thumbFileName = path.parse(file.name).name + '.jpg';
  // We can't easily download the image from here using fs, but the player will use the picsum URL
  // if it doesn't find a local file, or we can just create a dummy tiny jpg if needed.
});

console.log('Dummy music files created in music/ folder');
