# Valourine

Valourine is a modern, minimalist music streaming application designed for a refined personal listening experience. It features a dynamic user interface that adapts its color palette based on the currently playing track's artwork.

## Key Features

- **Dynamic Theme**: The background and UI colors smoothly transition to match the mood of your music.
- **Multi-Page Navigation**: Optimized Home, Explore, and Library views.
- **Local Music Management**: Host your own music collection via the `/music` folder.
- **Manual Metadata**: Control song titles and genres using `music-metadata.json`.
- **IndexedDB Caching**: Ultra-fast performance and offline capability by caching previously played tracks.
- **Responsive Design**: Polished layout for both mobile and desktop users.

## Project Structure

- `/music`: Place your `.mp3`, `.wav`, etc. here.
- `/musict`: Place your album artwork images here.
- `music-metadata.json`: Configure genres and custom track naming.
- `server.ts`: Full-stack Express server to manage local assets and metadata.

## Development

1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Upload music to `/music` and thumbnails to `/musict` to see them in the app.
