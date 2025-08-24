'use client';

import Link from 'next/link';

export default function ContactCTA() {
  return (
    <section className="bg-[#FE9900] text-white py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Start Your Next Project?
        </h2>
        <p className="text-lg mb-8">
          Let Lemufex Engineering Group bring your vision to life with precision, safety, and excellence.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-white text-[#FE9900] font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition"
        >
          Contact Us
        </Link>
      </div>
    </section>
  );
}
