/**
 * VideoPlayer — Responsive iframe embed for YouTube/Vimeo videos.
 *
 * Converts standard watch/player URLs into embed-compatible URLs
 * and renders them in a responsive 16:9 container.
 */

import classes from "./VideoPlayer.module.css";

interface VideoPlayerProps {
  /** The video URL (YouTube or Vimeo watch/player URL). */
  videoUrl: string;
  /** Optional title for the iframe (accessibility). */
  title?: string;
}

/**
 * Convert a YouTube or Vimeo URL to an embeddable URL.
 * Supports:
 * - YouTube: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
 * - Vimeo: vimeo.com/ID, player.vimeo.com/video/ID
 */
function toEmbedUrl(url: string): string {
  // Already an embed URL
  if (url.includes("/embed/") || url.includes("player.vimeo.com")) {
    return url;
  }

  // YouTube — youtube.com/watch?v=ID
  const ytWatchMatch = url.match(
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/,
  );
  if (ytWatchMatch) {
    return `https://www.youtube.com/embed/${ytWatchMatch[1]}`;
  }

  // YouTube — youtu.be/ID
  const ytShortMatch = url.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytShortMatch) {
    return `https://www.youtube.com/embed/${ytShortMatch[1]}`;
  }

  // Vimeo — vimeo.com/ID
  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Fallback: return as-is
  return url;
}

export function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  const embedUrl = toEmbedUrl(videoUrl);

  return (
    <div className={classes.wrapper}>
      <iframe
        className={classes.iframe}
        src={embedUrl}
        title={title ?? "Vídeo da aula"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
