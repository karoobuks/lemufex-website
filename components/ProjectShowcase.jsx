'use client';

import Image from 'next/image';
import Link from 'next/link';
import electrical from "@/assets/images/electrical-installation.png"
import HVAC from "@/assets/images/HVAC-system-installation.png"
import steelFab from "@/assets/images/Structural-Steel-Fabrication.png"

const projects = [
  {
    title: 'Structural Steel Fabrication',
    description: 'Fabrication and installation of structural steel for an industrial plant.',
    image: steelFab,
    slug: '/projects/steel-fabrication',
  },
  {
    title: 'Commercial Electrical Installation',
    description: 'Full electrical setup for a 5-storey commercial complex in Lagos.',
    //image: '/assets/images/electrical-installation.png',
    image: electrical,
    slug: '/assets/images/electrical-installation',
  },
  {
    title: 'HVAC System Integration',
    description: 'Integrated energy-efficient HVAC system for a shopping mall.',
    image: HVAC,
    slug: '/projects/hvac-installation',
  },
];

export default function ProjectsShowcase() {
  return (
    <section className="bg-gray-50 py-16 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Our Recent Projects</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="h-52 relative">
                <Image
                  src={project.image}
                  alt={project.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-xl"
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                <Link href={project.slug}>
                  <span className="text-[#FE9900] hover:underline font-medium">
                    View Project →
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
