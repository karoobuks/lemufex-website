// 'use client';

// import { useState } from 'react';
// import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

// export default function ContactPage() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     message: ''
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // TODO: Add API submission or email integration
//     alert('Message submitted! (Implement submission)');
//   };

//   return (
//     <main className="bg-white text-gray-800">
//       {/* Hero Section */}
//       <section className="bg-[#FE9900] text-white py-16 px-6 text-center">
//         <h1 className="text-4xl font-bold">Get in Touch</h1>
//         <p className="mt-4 text-lg">We’re here to answer your questions and bring your projects to life.</p>
//       </section>

//       {/* Contact Form + Info */}
//       <section className="py-16 px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
//         {/* Form */}
//         <div>
//           <h2 className="text-2xl font-semibold mb-4">Send Us a Message</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="text"
//               name="name"
//               placeholder="Your Name"
//               required
//               onChange={handleChange}
//               className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FE9900]"
//             />
//             <input
//               type="email"
//               name="email"
//               placeholder="Your Email"
//               required
//               onChange={handleChange}
//               className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FE9900]"
//             />
//             <textarea
//               name="message"
//               rows={5}
//               placeholder="Your Message"
//               required
//               onChange={handleChange}
//               className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FE9900]"
//             />
//             <button
//               type="submit"
//               className="bg-[#FE9900] text-white px-6 py-3 rounded-md hover:bg-orange-600 transition"
//             >
//               Send Message
//             </button>
//           </form>
//         </div>

//         {/* Info */}
//         <div className="space-y-6">
//           <h2 className="text-2xl font-semibold mb-4">Our Contact Info</h2>
//           <div className="flex items-start gap-4">
//             <FaPhone className="text-[#FE9900] mt-1" />
//             <div>
//               <p className="font-medium">Phone</p>
//               <p>+234-000-000-0000</p>
//             </div>
//           </div>
//           <div className="flex items-start gap-4">
//             <FaEnvelope className="text-[#FE9900] mt-1" />
//             <div>
//               <p className="font-medium">Email</p>
//               <p>info@lemufex.com</p>
//             </div>
//           </div>
//           <div className="flex items-start gap-4">
//             <FaMapMarkerAlt className="text-[#FE9900] mt-1" />
//             <div>
//               <p className="font-medium">Office</p>
//               <p>123 Engineering Way, Lagos, Nigeria</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Google Map Embed */}
//       <section className="w-full">
//         <iframe
//           src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d..."
//           width="100%"
//           height="450"
//           allowFullScreen
//           loading="lazy"
//           className="border-t border-gray-200"
//         ></iframe>
//       </section>

//       {/* Optional Call-To-Action */}
//       <section className="bg-gray-100 py-12 text-center">
//         <h3 className="text-2xl font-semibold mb-3">Need a Custom Solution?</h3>
//         <p className="mb-6">Let’s discuss your project in detail. Our engineers are ready to collaborate.</p>
//         <a href="/career" className="bg-[#FE9900] text-white px-6 py-3 rounded-full hover:bg-orange-600">
//           Work With Us
//         </a>
//       </section>
//     </main>
//   );
// }



import ContactHero from "@/components/ContactHero";
import ContactForm from "@/components/ContactForm";
import ContactDetails from "@/components/ContactDetails";
import ContactMap from "@/components/ContactMap";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <ContactHero />

      <section className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
        <ContactForm />
        <ContactDetails />
        <ContactMap/>
      </section>
    </div>
  );
}
