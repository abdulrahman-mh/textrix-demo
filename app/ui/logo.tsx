import Image from "next/image";

export default function Logo() {
  return (
    <div>
      <a
        target="_blank"
        rel="noreferrer noopener"
        href="https://textrix.vercel.app"
        draggable="false"
        className="inline-block select-none mr-5 [@media(max-width:365px)]:mr-0"
      >
        <Image
          src="/textrix-logo.png"
          width={150}
          height={50}
          alt="textrix logo"
          className="pointer-events-none min-w-[100px] max-w-[150px] w-full select-none"
        />
      </a>
    </div>
  );
}
