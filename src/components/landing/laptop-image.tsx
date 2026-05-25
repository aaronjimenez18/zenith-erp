import Image from "next/image";

export function LaptopImage() {
  return (
    <div className="relative flex items-center justify-center">
      <div
        className="absolute -inset-12 rounded-[120px] bg-gradient-to-b from-[#134235]/15 via-[#134235]/5 to-transparent blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -bottom-3 left-1/2 h-3 w-[65%] -translate-x-1/2 rounded-full bg-[#134235]/15 blur-[6px]"
        aria-hidden
      />
      <div className="relative motion-safe:animate-float">
        <Image
          src="/landing/zenith-laptop.webp"
          alt="Zenith ERP"
          width={1804}
          height={872}
          priority
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}
