import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="bg-[#FE9900] text-white text-center py-16 px-6">
      <h2 className="text-3xl font-bold mb-4">Let's Build Something Great Together</h2>
      <p className="mb-6">Whether you're looking for an engineering partner or seeking career opportunities, we're excited to hear from you.</p>
      <Link href="/contact" className="inline-block bg-white text-[#FE9900] font-semibold px-6 py-3 rounded-full hover:bg-gray-100">
        Contact Us
      </Link>
    </section>
  );
}
