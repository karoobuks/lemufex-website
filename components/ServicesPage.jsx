// app/services/page.jsx
'use client';


import React from 'react';
import Link from 'next/link';

const services = [
  {
    id: 'civil',
    title: 'Civil & Structural Engineering',
    description: 'Structural design, road & bridge construction, concrete & foundation engineering.',
  },
  {
    id: 'mechanical',
    title: 'Mechanical Engineering',
    description: 'HVAC system design and installation, piping and plumbing, fire protection systems.',
  },
  {
    id: 'electrical',
    title: 'Electrical Engineering',
    description: 'Power distribution, lighting, solar & backup, and control systems.',
  },
  {
    id: 'environmental',
    title: 'Environmental Engineering',
    description: 'EIA, pollution control, waste management, sustainability consulting.',
  },
  {
    id: 'project',
    title: 'Project Management & Consultancy',
    description: 'Feasibility studies, cost estimation, procurement, supervision, QA/QC.',
  },
  {
    id: 'design',
    title: 'Design & Drafting Services',
    description: 'AutoCAD, Revit, 3D modeling, rendering for architectural & MEP services.',
  },
];

const ServicesPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-primary">Our Services</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map(({ id, title, description }) => (
          <div
            key={id}
            id={id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-dark mb-2">{title}</h2>
            <p className="text-sm text-gray-700 mb-4">{description}</p>
            <Link href={`/request-quote?service=${id}`}>
              <button className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition-all">
                Request Quote
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
