import { useEffect, useRef, useState, useMemo } from "react";
import { html as beautify } from "js-beautify";
import { Editor } from "textrix";
import { HLJSApi } from "highlight.js";
import GoBackButton from "./go-back-button";
import { zoomImageHandler } from "textrix"

interface ArticleProps {
  editor: Editor;
  hljs: HLJSApi;
  onClose: () => void;
}

type ViewMode = "preview" | "html" | "json";

export default function Article({ editor, hljs, onClose }: ArticleProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [copied, setCopied] = useState(false);

  const rawHtml = useMemo(() => editor.getHTML(), [editor]);
  const beautifiedHtml = useMemo(
    () =>
      beautify(rawHtml, {
        indent_size: 2,
        inline: [],
      }),
    [rawHtml]
  );

  const json = useMemo(
    () => JSON.stringify(editor.getJSON(), null, 2),
    [editor]
  );

  const highlightedHtml = useMemo(
    () => hljs.highlight(beautifiedHtml, { language: "html" }).value,
    [beautifiedHtml]
  );

  const highlightedJson = useMemo(
    () => hljs.highlight(json, { language: "json" }).value,
    [json]
  );

  useEffect(() => {
    document.body.classList.add("lock-scroll");
    setAnimateIn(true);
    return () => {
      document.body.classList.remove("lock-scroll");
      zoomImageHandler.cleanup();
    };
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;

    const runZoom = () => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          zoomImageHandler.run({ container: scrollRef.current! });
        }, 0);
      });
    };

    runZoom();

    return () => {
      zoomImageHandler.cleanup();
    };
  }, [rawHtml, viewMode]);

  const handleCopy = () => {
    const content = viewMode === "html" ? beautifiedHtml : json;
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const withLineNumbers = (code: string) =>
    code
      .split("\n")
      .map(
        (line, i) =>
          `<span class="line-number" data-line="${i + 1}"></span>${line}`
      )
      .join("\n");

  const modes: ViewMode[] = ["preview", "html", "json"];

  return (
    <div
      ref={scrollRef}
      className={`fixed inset-0 z-[9900] w-screen h-screen bg-white overflow-auto ${
        animateIn ? "popup-enter" : "popup-leave"
      }`}
    >
      <header className="flex justify-between items-center max-w-[1072px] w-full mx-auto h-[70px] px-4 border-b">
        <GoBackButton back={onClose} />

        <div className="hidden sm:flex items-center gap-2">
          {modes.map((mode) => (
            <label
              key={mode}
              className={`px-3 py-1 rounded-md text-sm font-medium border cursor-pointer transition ${
                viewMode === mode
                  ? "bg-[#1a8917] text-white border-[#1a8917]"
                  : "bg-white text-gray-800 border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                type="radio"
                name="viewMode"
                value={mode}
                checked={viewMode === mode}
                onChange={() => setViewMode(mode)}
                className="sr-only"
              />
              {mode[0].toUpperCase() + mode.slice(1)}
            </label>
          ))}
        </div>

        <div className="sm:hidden">
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as ViewMode)}
            className={`w-full px-3 py-1 rounded-md text-sm font-medium cursor-pointer border transition
      ${
        viewMode === "preview"
          ? "bg-[#1a8917] text-white border-[#1a8917]"
          : "bg-white text-gray-800 border-gray-300 hover:border-gray-400"
      }
    `}
          >
            {modes.map((mode) => (
              <option key={mode} value={mode}>
                {mode[0].toUpperCase() + mode.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </header>

      {viewMode === "preview" && (
        <article
          className="mx-auto"
          dangerouslySetInnerHTML={{ __html: rawHtml }}
        />
      )}

      {viewMode !== "preview" && (
        <div className="max-w-[1072px] mx-auto my-6 px-3 sm:px-4">
        <div className="border border-[#d1d9e0] rounded overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#f6f8fa] border-[#d1d9e0] px-4 py-2 border-b text-md text-gray-800 gap-2 sm:gap-0">
            <span className="sm:flex-1 text-sm sm:text-base leading-relaxed">
              {viewMode === "html"
                ? "This is the final rendered HTML output (you can use it to publish or embed elsewhere)."
                : "This is the JSON structure of the document (used for editing, saving, or generating the published HTML with it)."}
            </span>
            <button
              onClick={handleCopy}
              className="text-sm self-end bg-[#1a8917] text-white px-3 py-1 rounded hover:bg-[#0f730c] transition whitespace-nowrap"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre
            className="overflow-x-auto p-2 pt-3 pl-16 whitespace-pre break-words relative"
            style={{ counterReset: "line" }}
          >
            <code
              className={`language-${viewMode}`}
              dangerouslySetInnerHTML={{
                __html: withLineNumbers(
                  viewMode === "html" ? highlightedHtml : highlightedJson
                ),
              }}
            />
          </pre>
        </div>
        </div>
      )}
    </div>
  );
}
