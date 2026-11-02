import Image from "next/image";

export type AppShotName = "home" | "trip-details" | "capacity-calendar" | "news" | "news-detail";

const shots: Record<AppShotName, { src: string; width: number; height: number }> = {
  home: { src: "/app-screens/home.webp", width: 1290, height: 2796 },
  "trip-details": { src: "/app-screens/trip-details.webp", width: 1290, height: 2796 },
  "capacity-calendar": { src: "/app-screens/capacity-calendar.webp", width: 1290, height: 2796 },
  news: { src: "/app-screens/news.webp", width: 1290, height: 2796 },
  "news-detail": { src: "/app-screens/news-detail.webp", width: 1290, height: 2796 },
};

export default function RealAppShot({ screen, alt, className = "", src }: { screen: AppShotName; alt: string; className?: string; src?: string }) {
  const shot = shots[screen];
  const imageSource = src || shot.src;
  return (
    <figure className={`real-app-shot ${className}`}>
      <Image src={imageSource} alt={alt} width={shot.width} height={shot.height} sizes="(max-width: 720px) 70vw, 360px" unoptimized={imageSource.startsWith("http")} />
    </figure>
  );
}
