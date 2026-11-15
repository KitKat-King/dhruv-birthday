import LyricLab from "./lyric-lab";
import { asset } from "@/lib/asset";

export const metadata = {
  title: "Dhruv — Lyric Lab",
  description:
    "The pink lock opens the lyric studio: Soni Soni, its lyrics, the AI lyric-video guide and the output player.",
  applicationName: "Dhruv — Lyric Lab",
  openGraph: {
    title: "Dhruv — Lyric Lab",
    description: "Soni Soni, synced word by word. Code required.",
    type: "website",
    images: [{ url: asset("/media/cover.png"), width: 1200, height: 630, alt: "Dhruv — Lyric Lab" }],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fff0f5",
};

export default function Page() {
  return <LyricLab />;
}
