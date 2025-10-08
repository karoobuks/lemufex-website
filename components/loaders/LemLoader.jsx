"use client";
import Image from "next/image";

export default function LemLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="animate-spin ">
        <Image
          src="/favicon-lemufex.ico" 
          alt="Lemufex Loader"
          width={80}
          height={80}
          className=" rounded-full drop-shadow-lg dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
        />
      </div>
    </div>
  );
}