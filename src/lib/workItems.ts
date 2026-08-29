import { PortfolioData, VideoItem, Photo } from "@/types/portfolio";

export type WorkItem =
  | { kind: "video"; id: string; label: string; thumbnail?: string; video: VideoItem }
  | { kind: "photo"; id: string; label: string; thumbnail?: string; photo: Photo };

/**
 * Flattens videos + photos into individual desktop-icon-worthy work items.
 * Each becomes its own scattered icon on the desktop (see WorkIcon /
 * scatterPosition), rather than living behind a single "Videos"/"Photos"
 * folder — the MiMac-style "the desktop is the portfolio grid" approach.
 */
export function buildWorkItems(data: PortfolioData): WorkItem[] {
  const items: WorkItem[] = [];

  (data.videos || []).forEach((video) => {
    items.push({
      kind: "video",
      id: `work-video-${video.id}`,
      label: video.title,
      thumbnail: video.poster,
      video,
    });
  });

  (data.photos || []).forEach((photo) => {
    items.push({
      kind: "photo",
      id: `work-photo-${photo.id}`,
      label: photo.caption,
      thumbnail: photo.url,
      photo,
    });
  });

  return items;
}
