import "bootstrap/dist/css/bootstrap-grid.min.css";
import "./globals.css";
import SmoothScroll from "@/components/providers/smooth-scroll";
import { asset } from "@/lib/asset";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Dhruv — Golden Hour",
  description:
    "A private birthday transmission for Dhruv. Chapter Gold: it's your golden hour.",
  applicationName: "Dhruv — Golden Hour",
  authors: [{ name: "From your best friend" }],
  openGraph: {
    title: "Dhruv — Golden Hour",
    description: "A private birthday transmission. Unlock the golden hour.",
    type: "website",
    images: [{ url: asset("/media/cover.svg"), width: 1200, height: 630, alt: "Dhruv — Golden Hour" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dhruv — Golden Hour",
    description: "A private birthday transmission. Unlock the golden hour.",
    images: [asset("/media/cover.svg")],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0806",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
