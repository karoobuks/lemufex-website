'use client'

import React from "react"
import Link from "next/link";
import { FaTools, FaHardHat, FaCog, 
FaBolt, FaRobot, FaChalkboardTeacher, 
FaProjectDiagram, FaCode, FaLaptopCode, 
FaLeaf } from 'react-icons/fa';

const services = [
    {
        icon:<FaHardHat className="text-[#FE9900] text-4xl" />,
        title:'Civil & Structural Engineering',
        items:[
            'Structural design and analysis',
            'Road and bridge construction',
            'Concrete work and foundational engineering',
            'Renovation and restoration projects',
        ],
    },
    {
        icon:<FaCog className="text-[#FE9900] text-4xl" />,
        title:'Mechanical Engineering Services',
        items:[
            'HVAC system design and installation',
            'Industrial piping and plumbing',
            'Mechanical equipment installation and servicing',
            'Plant layout design',
        ],
    },
    { 
        icon: <FaBolt className="text-[#FE9900] text-4xl" />,
        title: 'Electrical Engineering & Power Systems',
        items: [
        'Electrical installations and maintenance',
        'Power distribution systems',
        'Transformer and substation installation',
        'Renewable energy and solar solutions',
        ],
    },
    {
        icon: <FaRobot className="text-[#FE9900] text-4xl" />,
        title: 'Industrial Automation & Control',
        items: [
        'Process automation and optimization',
        'SCADA, PLC, and HMI systems',
        'Sensor integration and machine control',
        'Industrial robotics and smart systems',
        ],
    },
    {
        icon: <FaTools className="text-[#FE9900] text-4xl" />,
        title: 'Installation & Plant Commissioning',
        items: [
        'Equipment installation and setup',
        'Factory acceptance testing (FAT)',
        'Site acceptance testing (SAT)',
        'Full plant commissioning and handover',
        ],
    },
    {
        icon: <FaChalkboardTeacher className="text-[#FE9900] text-4xl" />,
        title: 'Technical Training & Workshops',
        items: [
        'Engineering software and system training',
        'Automation and control systems training',
        'Custom workshops for industrial staff',
        'Safety and compliance workshops',
        ],
    },
    {
        icon: <FaProjectDiagram className="text-[#FE9900] text-4xl" />,
        title: 'Engineering Procurement & Construction (EPC)',
        items: [
        'Turnkey project delivery',
        'Material procurement and logistics',
        'Construction supervision and quality assurance',
        'Project lifecycle management',
        ],
    },
    {
        icon: <FaLaptopCode className="text-[#FE9900] text-4xl" />,
        title: 'ICT & Software Development',
        items: [
        'Web Design & Development',
        'Web Application Design (Frontend & Backend)',
        'Windows Desktop Application Development',
        'Systems integration and deployment',
        'Database development and cloud solutions',
        ],
    },
    {
        icon: <FaCode className="text-[#FE9900] text-4xl" />,
        title: 'Programming Services',
        items: [
        'Custom software programming (Python, C#, Java, etc.)',
        'Embedded system programming',
        'Automation scripting and algorithm development',
        'Code debugging and optimization',
        ],
    },
    {
        icon: <FaProjectDiagram className="text-[#FE9900] text-4xl" />,
        title: 'Project Management & Consultancy',
        items: [
        'Technical feasibility studies',
        'Engineering audits and assessments',
        'Construction and contract management',
        'Regulatory compliance consulting',
        ],
    },
    {
        icon: <FaLeaf className="text-[#FE9900] text-4xl" />,
        title: 'Environmental & Sustainable Engineering',
        items: [
        'Environmental impact assessments (EIA)',
        'Green building solutions',
        'Sustainable urban infrastructure',
        'Waste and energy management',
        ],
    },
]

export default function Services() {
  return (
    <section className="bg-[#F4F4F4] py-16 px-4 lg:px-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[#002B5B]">Our Engineering Services</h2>
        <p className="text-gray-600 mt-2 max-w-xl mx-auto">
          Lemufex Engineering Group delivers robust solutions across multiple engineering disciplines. Here’s what we offer:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div key={index} className="bg-white rounded-xl shadow hover:shadow-lg transition duration-300 p-6 border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              {service.icon}
              <h3 className="text-xl font-semibold text-[#002B5B]">{service.title}</h3>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {service.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            {/* <button className="mt-6 bg-[#FE9900] hover:bg-[#e28500] text-white px-4 py-2 rounded-full text-sm">
              Request Quote
            </button> */}
            <Link
              href={{
                pathname: '/request-quotes',
                query: {
                  title: service.title,
                  items: JSON.stringify(service.items),
                }
                // query: {
                //   title: service.title,
                //   ...service.items.reduce((acc, item, i) => {
                //     acc[`item${i}`] = item;
                //     return acc;
                //   }, {}),
                // },
  

              }}
            >
              <button className="mt-6 bg-[#FE9900] hover:bg-[#e28500] text-white px-4 py-2 rounded-full text-sm">
                Request Quote
              </button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}


