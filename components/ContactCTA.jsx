"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FaRocket, FaUsers, FaTools } from "react-icons/fa";

export default function ContactCTA() {
  const { data: session } = useSession();
  const isTrainee = session?.user?.isTrainee;
  const trainingHref = isTrainee ? "/dashboard" : "/register-training";
  const trainingText = isTrainee ? "Go to Dashboard" : "Start Training";

  return (
    <section className="bg-gradient-to-r from-[#081C3C] to-[#0D274D] py-16">
      <div className="max-w-4xl mx-auto px-4 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Start Your <span className="text-[#FE9900]">Engineering Journey</span>?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Join hundreds of professionals who have advanced their careers with Lemufex Engineering.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <FaRocket className="text-3xl text-[#FE9900] mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Launch Your Project</h3>
            <p className="text-sm text-blue-100">Get expert engineering consultation</p>
          </div>
          <div className="text-center">
            <FaUsers className="text-3xl text-[#FE9900] mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Join Our Training</h3>
            <p className="text-sm text-blue-100">Advance your technical skills</p>
          </div>
          <div className="text-center">
            <FaTools className="text-3xl text-[#FE9900] mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Custom Solutions</h3>
            <p className="text-sm text-blue-100">Tailored engineering services</p>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/services"
            className="bg-[#FE9900] text-[#002B5B] px-6 py-3 rounded-lg font-semibold hover:bg-orange-400 transition-colors"
          >
            View Our Services
          </Link>
          <Link
            href={trainingHref}
            className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#002B5B] transition-colors"
          >
            {trainingText}
          </Link>
        </div>
      </div>
    </section>
  );
}