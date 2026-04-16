export interface Track {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  isFullPlayer: boolean;
}
