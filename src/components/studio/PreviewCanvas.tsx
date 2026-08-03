"use client";

export function PreviewCanvas({ 
  baseImage, 
  userImage,
  engravingText
}: { 
  baseImage: string; 
  userImage?: string;
  engravingText?: string;
}) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-[var(--color-surface-dim)] shadow-soft-lift flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={baseImage} alt="Product Base" className="absolute inset-0 h-full w-full object-cover z-0" />
      
      {/* Mock compositing area for the personalized image */}
      {userImage && (
        <div className="absolute inset-[20%] z-10 border-2 border-dashed border-white/50 bg-black/10 overflow-hidden rounded shadow-inner flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={userImage} alt="User Upload" className="h-full w-full object-cover opacity-90" />
        </div>
      )}

      {/* Mock engraving text */}
      {engravingText && (
        <div className="absolute bottom-[15%] w-full text-center z-20 px-8">
          <p className="font-serif text-lg font-bold text-black/70 italic drop-shadow-sm">{engravingText}</p>
        </div>
      )}
    </div>
  );
}
