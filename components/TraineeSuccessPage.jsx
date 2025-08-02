'use client';
import Link from "next/link";

export default function TraineeSuccessPage() {
  return (
    <main className="min-h-screen bg-[#081C3C] flex flex-col items-center justify-center p-6 text-white">
      <div className="bg-[#0D274D] rounded-2xl shadow-lg p-10 max-w-xl w-full text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#F8C400] mb-4">
          🎉 You're Officially In!
        </h1>
        <p className="text-lg text-gray-200 mb-6">
          Welcome to <span className="text-[#00F49C] font-semibold">Lemufex Academy</span>, where your future in
          <br /> Automation, Electrical Systems & Software Programming begins.
        </p>

        <div className="my-6">
          <p className="text-md italic text-[#A0AEC0]">
            "Empowering the next generation of tech professionals with real-world skills."
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-block mt-6 px-6 py-3 bg-[#00F49C] text-[#081C3C] font-semibold rounded-lg hover:bg-[#00dd89] transition"
        >
          Go to Dashboard
        </Link>
      </div>

      {/* <footer className="mt-10 text-sm text-[#F8C400]">
        &copy; {new Date().getFullYear()} Lemufex Academy. All rights reserved.
      </footer> */}
    </main>
  );
}
