"use client";

import * as React from "react"
import { cn } from "@/lib/utils"

export function BottomSheet({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title?: string, children: React.ReactNode }) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-x-0 bottom-0 z-50 mt-24 rounded-t-[26px] bg-[var(--color-surface-white)] p-6 shadow-2xl transition-transform animate-in slide-in-from-bottom-full">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[var(--color-surface-dim-2)]" />
        {title && <h2 className="mb-4 text-lg font-semibold font-serif">{title}</h2>}
        {children}
      </div>
    </>
  )
}
