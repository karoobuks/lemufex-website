// components/CareerSection.jsx
"use client"

import Link from "next/link"

const CareerSection = () => {
  return (
    <section className="bg-[#0B132B] py-12 px-6 md:px-20 text-white">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#FE9900]">
          Ready to Launch Your Tech Career?
        </h2>
        <p className="text-lg md:text-xl text-gray-200 mb-6">
          Join our intensive training programs in <span className="text-white font-semibold">Automation</span>, <span className="text-white font-semibold">Electrical Engineering</span>, and <span className="text-white font-semibold">Software Programming</span>.
        </p>
        <Link
          href="/register-training"
          className="inline-block bg-[#FE9900] text-white font-medium py-3 px-6 rounded-lg hover:bg-orange-500 transition duration-300"
        >
          Register for the Trainee Program
        </Link>
      </div>
    </section>
  );
};

export default CareerSection;
