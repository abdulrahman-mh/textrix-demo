"use client";

import { useState } from "react";
import { CheckMark, Copy, X } from "../icons";

export default function ModelHeader({
  copy,
  onClose,
  title,
  description,
}: {
  copy: () => void;
  onClose: () => void;
  title: string;
  description?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className=" sticky top-0 py-3 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            title="Copy"
            onClick={handleCopy}
            className="h-10 px-2 rounded-lg cursor-pointer hover:bg-[rgba(0,0,0,.07)]"
          >
            {copied ? <CheckMark /> : <Copy />}
          </button>
        </div>

        <button
          className="relative -right-3 h-10 px-2 rounded-lg cursor-pointer hover:bg-[rgba(0,0,0,.07)]"
          title="Close"
          onClick={onClose}
        >
          <X />
        </button>
      </div>
      <p className="mb-0! text-gray-600">{description}</p>
    </div>
  );
}
