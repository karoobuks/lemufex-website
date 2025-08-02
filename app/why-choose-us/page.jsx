'use client'

import { FaCheckCircle, FaShieldAlt, FaClock, FaUsers } from "react-icons/fa";

const reasons = [
    {
        title:'Expertise You Can Trust',
        description:"Our team of certified engineers brings decades of combined experience across civil, mechanical, and general engineering services.",
        icon: <FaShieldAlt className="text-[#FE9900] text-3xl mb-2" />,
    },
    {
        title:"Timely Delivery",
        description:"We meet deadlines without compromizing on quality. Our project ensures smooth execution from start to finish.",
         icon: <FaClock className="text-[#FE9900] text-3xl mb-2" />,
    },
    {
        title:"Client-Centric Approach",
        description:"Your satisfaction drives us. We tailor every projects to meet your unique needs, goals and vision.",
        icon:<FaUsers className="text-[#FE9900] text-3xl mb-2" />,
    },
    {
        title:"Quality Assurance",
        description:"We uphold the highest standards through rigorous testing, detailed checks, and use of premium materials",
        icon: <FaCheckCircle className="text-[#FE9900] text-3xl mb-2" />,
    }
]

const WhyChooseUs = () => {
    return ( 
        <div className="bg-[#F8F9FC] min-h-screen py-16 px-4 sm:px-8">
            <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#002B5B] mb-4">Why Choose Lemufex?</h1>
            <p className="text-[#444] max-w-2xl mx-auto mb-12 text-lg"> We combine innovation, professionalism, and proven results to bring your engineering projects to life.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {reasons.map((reason, index) =>(
                    <div key={index}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 text-left">
                        {reason.icon}
                        <h3 className="text-xl font-semibold text-[#002B5B] mb-2">{reason.title}</h3>
                        <p className="text-[#555]">{reason.description}</p>
                    </div>
                ))}
            </div>
            </div>

        </div>
     );
}
 
export default WhyChooseUs