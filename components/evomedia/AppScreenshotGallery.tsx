import Image from "next/image";

export function AppScreenshotGallery({
  images,
  appName,
}: {
  images: string[];
  appName: string;
}) {
  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {images.map((src) => (
        <div
          key={src}
          className="relative aspect-[9/19.5] rounded-xl overflow-hidden border border-white/10 bg-[#12121a] shadow-lg"
        >
          <Image
            src={src}
            alt={`${appName} screenshot`}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover object-top"
          />
        </div>
      ))}
    </div>
  );
}
