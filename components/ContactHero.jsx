import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactHero() {
  return (
    <section className="bg-gradient-to-r from-[#081C3C] to-[#0D274D] text-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Let's Build Something <span className="text-[#FE9900]">Amazing</span> Together
        </h1>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Ready to discuss your engineering project? Our expert team is here to turn your vision into reality.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <FaPhone className="text-[#FE9900]" />
            <span>Quick Response</span>
          </div>
          <div className="flex items-center gap-2">
            <FaEnvelope className="text-[#FE9900]" />
            <span>Professional Support</span>
          </div>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-[#FE9900]" />
            <span>Lagos, Nigeria</span>
          </div>
        </div>
      </div>
    </section>
  );
}