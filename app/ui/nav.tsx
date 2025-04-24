'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Modal from './popup/model';
import type { Editor } from 'textrix';
import { html as htmlBeautify } from 'js-beautify';
import hljs from 'highlight.js/lib/core';
import htmlLang from 'highlight.js/lib/languages/xml';
import jsonLang from 'highlight.js/lib/languages/json';
import ModelHeader from './popup/model-header';

import 'highlight.js/styles/github.css'; // GitHub Light theme

hljs.registerLanguage('html', htmlLang);
hljs.registerLanguage('json', jsonLang);

export default function Nav({ editor }: { editor: Editor | null }) {
  const [isHtmlModalOpen, setHtmlModalOpen] = useState(false);
  const [isJsonModalOpen, setJsonModalOpen] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const [jsonContent, setJsonContent] = useState('');

  useEffect(() => {
    if (isHtmlModalOpen && editor) {
      const rawHtml = editor.getHTML();
      const formattedHtml = htmlBeautify(rawHtml, { indent_size: 2 });
      setHtmlContent(hljs.highlight(formattedHtml, { language: 'html' }).value);
    }
    if (isJsonModalOpen && editor) {
      const rawJson = JSON.stringify(editor.getJSON(), null, 2);
      setJsonContent(hljs.highlight(rawJson, { language: 'json' }).value);
    }
  }, [isHtmlModalOpen, isJsonModalOpen, editor]);

  return (
    <div className="flex justify-between items-center max-w-[1072px] w-full mx-auto h-[70px] px-4">
      <div>
        <a
          target="_blank" rel="noreferrer noopener" 
          href="https://textrix.vercel.app"
          draggable="false"
          className="inline-block select-none mr-5 [@media(max-width:365px)]:mr-0">
          <Image
            src="/textrix-logo.png"
            width={150}
            height={50}
            alt="textrix logo"
            className="pointer-events-none min-w-[100px] max-w-[150px] w-full select-none"
          />
        </a>
      </div>
      <div className="flex items-center flex-col sm:flex-row">
        {/* <a
          className="flex items-center mr-8 cursor-pointer"
          href="#">
          <Image
            src="/buy-me-a-coffee.svg"
            width={35}
            height={35}
            alt="Support Development by Buy Me a Coffee"
          />
          Buy Me a Coffee (Soon)
        </a> */}
        <button
          type="button"
          onClick={() => setHtmlModalOpen(true)}
          className="cursor-pointer sm:mr-1 mb-1 sm:mb-0 text-nowrap text-white bg-[#1a8917] hover:bg-[#0f730c] focus:outline-none rounded-[99em] px-[10px] py-0 items-center">
          Export HTML
        </button>
        <button
          type="button"
          onClick={() => setJsonModalOpen(true)}
          className="cursor-pointer sm:mr-4 text-nowrap text-white bg-[#1a8917] hover:bg-[#0f730c] focus:outline-none rounded-[99em] px-[10px] py-0 items-center">
          Export JSON
        </button>
        <a
          target="_blank" rel="noreferrer noopener" 
          href="https://github.com/abdulrahman-mh/textrix"
          className="hidden sm:flex gap-2 [@media(max-width:365px)]:hidden">
          <Image
            src="/github.svg"
            width={16}
            height={16}
            alt="GitHub"
          />
          <span>GitHub</span>
        </a>
      </div>

      {/* HTML Export Modal */}
      <Modal
        isOpen={isHtmlModalOpen}
        onClose={() => setHtmlModalOpen(false)}>
        <ModelHeader
          copy={() =>
            navigator.clipboard.writeText(htmlBeautify(editor!.getHTML(), { indent_size: 2 }))
          }
          onClose={() => setHtmlModalOpen(false)}
          title="Published HTML"
          description="The final rendered content, displayed as a published content, view-only post or story."></ModelHeader>
        <pre className="mt-2! overflow-auto h-full w-full flex-1">
          <code
            className="language-html"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </pre>
      </Modal>

      {/* JSON Export Modal */}
      <Modal
        isOpen={isJsonModalOpen}
        onClose={() => setJsonModalOpen(false)}>
        <ModelHeader
          copy={() => navigator.clipboard.writeText(JSON.stringify(editor!.getJSON(), null, 2))}
          onClose={() => setJsonModalOpen(false)}
          title="JSON Content"
          description="The editable document structure, used for saving changes, handling user changes or generating the published HTML."></ModelHeader>
        <pre className="mt-2! overflow-auto h-full w-full flex-1">
          <code
            className="language-json"
            dangerouslySetInnerHTML={{ __html: jsonContent }}
          />
        </pre>
      </Modal>
    </div>
  );
}
