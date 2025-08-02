
"use client";

import Link from "next/link";
import { FaTools, FaDraftingCompass, FaCogs } from "react-icons/fa";

const services = [
  {
    title: "Civil & Structural Engineering",
    description: "From road and bridge construction to structural design and restoration projects.",
    icon: <FaDraftingCompass className="text-4xl text-[#FE9900]" />,
    link: "/services/civil-structural",
  },
  {
    title: "Mechanical Engineering",
    description: "HVAC systems, mechanical installations, and plant equipment solutions.",
    icon: <FaCogs className="text-4xl text-[#FE9900]" />,
    link: "/services/mechanical",
  },
  {
    title: "General Engineering Services",
    description: "Broad engineering support tailored to your industry and infrastructure.",
    icon: <FaTools className="text-4xl text-[#FE9900]" />,
    link: "/services/general",
  },
];

const ServicesPreview = () => {
  return (
    <section className="py-16 bg-[#F4F6F8]">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#002B5B]">Our Core Services</h2>
        <p className="text-[#6B7280] mb-12 max-w-2xl mx-auto">
          Lemufex Engineering Group offers innovative and reliable solutions across multiple engineering domains.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-white shadow-lg rounded-xl p-6 text-left hover:shadow-xl transition duration-300 border border-[#E5E7EB]"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-[#002B5B] mb-2">{service.title}</h3>
              <p className="text-[#6B7280] mb-4">{service.description}</p>
              <Link href={service.link} className="text-[#FE9900] font-semibold hover:underline">
                Request Quote →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
