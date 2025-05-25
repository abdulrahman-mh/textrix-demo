'use client';

import { useEffect, useRef, useState } from 'react';
import { Editor } from 'textrix';
import { Media, CodeBlock, Emoji, BubbleMenu, FloatingMenu } from 'textrix/features';

import Nav from './ui/nav';

// Deploy URL for <https://github.com/abdulrahman-mh/iframe-extractor>
const IFRAME_EXTRACTOR_URL = "https://iframe-extractor-hzya.onrender.com/api"

async function fetchMedia({ url }: { url: string }) {
  const res = await fetch(`${IFRAME_EXTRACTOR_URL}/media?url=${encodeURIComponent(url)}&maxwidth=9000&maxheight=9000`);
  if (!res.ok) {
    throw new Error(`Failed to fetch media: ${res.statusText}`);
  }
  const data = await res.json();
  return data;
}

export default function Home() {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const editorInstanceRef = useRef<Editor | null>(null);
  const [editor, setEditor] = useState<Editor | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      const editor = new Editor({
        element: editorRef.current,
        autoTextDirection: true,
        markdownShortcuts: true,
        features: [Media.configure({fetchMediaEmbedData: fetchMedia}), CodeBlock, Emoji, BubbleMenu, FloatingMenu],
      });

      editorInstanceRef.current = editor;
      setEditor(editor);
    }

    return () => {
      editorInstanceRef.current?.destroy();
      editorInstanceRef.current = null;
      setEditor(null);
    };
  }, []);

  return (
    <div>
      <Nav editor={editor} />
      <div
        ref={editorRef}
        className="mt-5"
      />
    </div>
  );
}
