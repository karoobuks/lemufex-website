// components/Hero.jsx
import Image from "next/image";
import Link from "next/link";
import Crane from '@/assets/images/crane-construction-site.jpg'

const Hero = () => {
  return (
    <section className="bg-[#1E2A38] text-[#E5E7EB]   py-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Building the Future with <span className="text-[#FE9900]">Precision</span> and <span className="text-[#FE9900]">Excellence</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            At <span className="text-[#FE9900] font-bold">Lemufex Engineering Group</span>, we specialize in delivering world-class Civil, Structural, and Mechanical engineering services tailored to your needs.
          </p>
          <div className="flex gap-4">
            <Link
              href="/services"
              className="bg-[#FE9900] text-[#1E2A38] px-6 py-3 font-semibold rounded-lg shadow-md hover:bg-orange-500 transition"
            >
              Our Services
            </Link>
            <Link
              href="/contact"
              className="border border-[#FE9900] text-[#FE9900] px-6 py-3 font-semibold rounded-lg hover:bg-[#FE9900] hover:text-[#1E2A38] transition"
            >
              Get in Touch
            </Link>
          </div>
        </div>

        
        <div className="md:w-1/2">
          <Image
            src={Crane} // Replace with your image path
            alt="Engineering illustration"
            width={600}
            height={400}
            className="rounded-xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
