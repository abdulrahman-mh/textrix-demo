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
    <div className="flex justify-between items-center [@media(max-width:365px)]:justify-center max-w-[1072px] w-full mx-auto h-[70px] px-4">
      <div>
        <a
          href="https://github.com/abdulrahman-mh/textrix"
          draggable="false"
          className="inline-block select-none mr-5 [@media(max-width:365px)]:mr-0">
          <Image
            src="/textrix.svg"
            width={150}
            height={50}
            alt="textrix logo"
            className="pointer-events-none min-w-[100px] max-w-[150px] w-full select-none"
          />
        </a>
      </div>
      <div className="flex items-center">
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
          className="cursor-pointer hidden sm:flex flex-nowrap text-nowrap text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-2 gap-1 py-1 items-center">
          <Image
            src="/code2.svg"
            width={20}
            height={20}
            alt="Export HTML"
          />
          Export HTML
        </button>
        <button
          type="button"
          onClick={() => setJsonModalOpen(true)}
          className="cursor-pointer hidden sm:flex items-center flex-nowrap text-nowrap text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-2 gap-1 py-1 mr-5 ml-2">
          <Image
            src="/brackets-curly.svg"
            width={20}
            height={20}
            alt="Export JSON"
          />
          Export JSON
        </button>
        <a
          href="https://github.com/abdulrahman-mh/textrix"
          className="flex gap-2 [@media(max-width:365px)]:hidden">
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
