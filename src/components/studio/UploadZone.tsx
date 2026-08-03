"use client";

import { useRef } from "react";
import { UploadCloud } from "lucide-react";

export function UploadZone({ onUpload }: { onUpload: (dataUrl: string) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-black/10 bg-[var(--color-surface-white)] p-8 text-center transition-colors hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/5 cursor-pointer"
      onClick={() => fileInputRef.current?.click()}
    >
      <UploadCloud className="mb-3 h-8 w-8 text-[var(--color-text-muted)]" />
      <h4 className="mb-1 text-sm font-semibold">Upload a Photo</h4>
      <p className="text-xs text-[var(--color-text-muted)]">Drag and drop or tap to browse</p>
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
