'use client';

import { useEffect, useRef, useState } from 'react';
import { Editor } from 'textrix';
import { Media, CodeBlock, Emoji, BubbleMenu, FloatingMenu } from 'textrix/features';

import Nav from './ui/nav';

export default function Home() {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [editor, setEditor] = useState<Editor | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      const editor = new Editor({
        element: editorRef.current,
        autoTextDirection: true,
        markdownShortcuts: true,
        features: [Media.configure({}), CodeBlock, Emoji, BubbleMenu, FloatingMenu],
      });

      setEditor(editor);
    }

    return () => {
      editor?.destroy();
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
