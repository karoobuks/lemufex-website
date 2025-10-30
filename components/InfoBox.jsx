// components/InfoBox.jsx
import Image from 'next/image';
import Link from 'next/link';
import ImageCarousel from './ImageCarousel';
import { 
  MdEngineering, 
  MdAcUnit, 
  MdHomeRepairService, 
  MdElectricalServices, 
} from "react-icons/md";
import { FaRoad, FaTools } from "react-icons/fa";

export default function InfoBox() {
  return (
    <section className="bg-[#FDFCF9] text-[#333] px-6 py-12 sm:px-10 lg:px-20 rounded-xl shadow-md max-w-7xl mx-auto mt-16">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left Text Content */}
        <div className="flex-1">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#FE9900] mb-4 leading-tight">
            Lemufex Engineering Group (LEG)
          </h2>

          <p className="text-base sm:text-lg mb-6 text-[#2E2E2E] leading-relaxed">
            We provide innovative, reliable, and efficient engineering services ranging from
            structural design to mechanical installations. With a commitment to excellence, we
            transform infrastructure and industrial challenges into success stories.
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base mb-8">
            <li className="flex items-start gap-2">
              <MdEngineering className="text-[#FE9900] text-lg" />
              Structural Design & Analysis
            </li>
            <li className="flex items-start gap-2">
               <FaRoad className="text-[#FE9900] text-lg" />
              Road & Bridge Construction
            </li>
            <li className="flex items-start gap-2">
               <MdAcUnit className="text-[#FE9900] text-lg" />
              HVAC Design & Installation
            </li>
            <li className="flex items-start gap-2">
              <MdHomeRepairService className="text-[#FE9900] text-lg" />
              Renovation & Restoration
            </li>
            <li className="flex items-start gap-2">
              <MdElectricalServices className="text-[#FE9900] text-lg" />
              Electrical installations Maintenance
            </li>
            <li className="flex items-start gap-2">
              <FaTools className="text-[#FE9900] text-lg" />
              Power distribution systems
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/services" className="bg-[#FE9900] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#cc7d00] transition duration-300">
              Request a Quote
            </Link>
            <Link href='/services'>
            <button className="border border-[#FE9900] text-[#FE9900] px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#FFF5EA] transition duration-300">
              View Services
            </button>
            </Link>
          </div>
        </div>

        
        <div className="flex-1 relative h-[300px] sm:h-[400px] w-full max-w-md">
          {/* <Image
            src="/images/lemufex-hero.jpg" // Replace with your actual image path
            alt="Lemufex Engineering"
            fill
            className="object-cover rounded-xl shadow-lg"
            priority
          /> */}
          <ImageCarousel/>
        </div>
      </div>
    </section>
  );
}
