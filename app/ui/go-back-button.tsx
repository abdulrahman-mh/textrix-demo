export default function GoBackButton({ back }: { back: () => void }) {
  return (
    <button
      onClick={back}
      className="relative -left-4 flex items-center min-[1360px]:fixed min-[1360px]:top-4 min-[1360px]:left-1! 2xl:left-4 gap-1 md:gap-3 text-gray-800 px-3 py-2
                 hover:text-[#0f730c] transition-all duration-300 sm:text-lg font-semibold sm:px-4"
    >
      <span className="hidden min-[1360px]:flex items-center justify-center w-8 h-8 bg-[#1a8917] rounded-full text-white">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </span>

      <span className="min-[1360px]:hidden w-4 h-4">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </span>

      {/* Text variations */}
      <span className="hidden min-[1360px]:inline">Go Back</span>
      <span className="min-[1360px]:hidden">Back</span>
    </button>
  );
}
