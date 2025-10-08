import Hero from "@/components/Hero";
import InfoBox from "@/components/InfoBox";
import ServicesPreview from "@/components/ServicePreview";
import CareerSection from "./CareerSection";
import ProjectsShowcase from "./ProjectShowcase";
import Testimonials from "./Testimonials";
import ContactCTA from "./ContactCTA";
import Link from "next/link";




const HomePage = ({ currentUser }) => {
    return ( <div>

        <Hero/>
        <InfoBox/>
        <CareerSection/>
        <ServicesPreview/>
        <ProjectsShowcase/>
        <Testimonials/>
        <ContactCTA/>
        
        
        {/* Admin Panel Button – Only visible to admins */}
      {currentUser?.role === 'admin' && (
        <div className="text-center mt-8">
          <Link href="/admin/users">
            <button className="bg-[#FE9900] hover:bg-amber-600 text-white px-6 py-2 rounded-lg shadow-md transition">
              👑 Go to Admin Panel
            </button>
          </Link>
        </div>
      )}
        

    </div> );
}
 
export default HomePage;