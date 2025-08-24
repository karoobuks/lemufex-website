'use client';
import React from 'react';
import AboutHero from '@/components/about/AboutHero';
import MissionVision from '@/components/about/MissionVision';
import OurValues from '@/components/about/OurValues';
import TeamPreview from '@/components/about/TeamPreview';
import CTASection from '@/components/about/CTAsection';

export default function AboutPage() {
  return (
    <main className="bg-gray-50 text-gray-800">
      <AboutHero />
      <MissionVision />
      <OurValues />
      <TeamPreview />
      <CTASection />
    </main>
  );
}
