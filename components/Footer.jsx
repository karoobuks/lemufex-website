
// export default function Footer() {
//   return (
//     <footer className="bg-[#1E2A38] text-gray-200 text-center py-4   w-full">
//       <p className="text-sm">
//         © {new Date().getFullYear()} Lemufex Engineering Group. All rights reserved.
//       </p>
//     </footer>
//   );
// }



// import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

// export default function Footer() {
//   return (
//     <footer className="bg-[#1E2A38] text-gray-300 pt-10">
//       <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
//         {/* Company Info */}
//         <div>
//           <h2 className="text-xl font-bold text-white">Lemufex Group</h2>
//           <p className="mt-3 text-sm leading-relaxed">
//             Providing top-notch services in civil, structural, automation, 
//             electrical, and software engineering. Training and services 
//             tailored to your needs.
//           </p>
//         </div>

//         {/* Quick Links */}
//         <div>
//           <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
//           <ul className="space-y-2 text-sm">
//             <li><a href="/about" className="hover:text-white">About Us</a></li>
//             <li><a href="/services" className="hover:text-white">Services</a></li>
//             <li><a href="/contact" className="hover:text-white">Contact</a></li>
//             <li><a href="/careers" className="hover:text-white">Careers</a></li>
//           </ul>
//         </div>

//         {/* Services */}
//         <div>
//           <h3 className="text-lg font-semibold text-white mb-3">Services</h3>
//           <ul className="space-y-2 text-sm">
//             <li>Electrical Engineering</li>
//             <li>Automation</li>
//             <li>Software Development</li>
//             <li>Civil & Structural Engineering</li>
//           </ul>
//         </div>

//         {/* Contact Info */}
//         <div>
//           <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
//           <ul className="space-y-2 text-sm">
//             <li>📍 Warri, Delta State, Nigeria</li>
//             <li>📞 +234 800 000 0000</li>
//             <li>✉️ info@lemufex.com</li>
//           </ul>
//           <div className="flex space-x-4 mt-4">
//             <a href="#" className="hover:text-white"><FaFacebookF /></a>
//             <a href="#" className="hover:text-white"><FaTwitter /></a>
//             <a href="#" className="hover:text-white"><FaLinkedinIn /></a>
//           </div>
//         </div>
//       </div>

//       {/* Bottom strip */}
//       <div className="border-t border-gray-700 mt-8 py-4 text-center text-sm text-gray-400">
//         © {new Date().getFullYear()} Lemufex Engineering Group. All rights reserved.
//       </div>
//     </footer>
//   );
// }


import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { useState } from "react";

export default function Footer() {

    const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setStatus("Loading...");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("✅ " + data.message);
        setEmail("");
      } else {
        setStatus("❌ " + data.message);
      }
    } catch (err) {
      setStatus("❌ Something went wrong");
    }
  };

  return (
    <footer className="bg-[#1E2A38] text-gray-200 py-10 mt-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1 - About */}
        <div>
          <h3 className="text-lg font-semibold mb-4">About Us</h3>
          <p className="text-sm leading-relaxed">
            Lemufex Engineering Group offers cutting-edge solutions in
            automation, electrical systems, and software programming,
            alongside world-class civil and structural engineering services.
          </p>
        </div>

        {/* Column 2 - Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">About</a></li>
            <li><a href="#" className="hover:text-white">Services</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Column 3 - Services */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Services</h3>
          <ul className="space-y-2 text-sm">
            <li>Automation Training</li>
            <li>Electrical Systems</li>
            <li>Software Programming</li>
            <li>Civil & Structural Engineering</li>
          </ul>
        </div>

        {/* Column 4 - Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <p className="text-sm">📍 Delta State, Nigeria</p>
          <p className="text-sm">📞 +234 800 00 0000</p>
          <p className="text-sm">📧 info@lemufexgroup.com</p>
        </div>
      </div>

      {/* Newsletter */}
      <div className="container mx-auto px-6 mt-10">
        <div className="bg-[#243447] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <h3 className="text-lg font-semibold">Subscribe to our Newsletter</h3>
          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 w-full md:w-64 rounded-l-lg text-gray-200 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-[#FE9900] hover:bg-amber-600 text-white px-4 py-2 rounded-r-lg"
            >
              Subscribe
            </button>
          </form>
          
             {status && (
          <p className="text-center mt-3 text-sm text-gray-300">{status}</p>
        )}
          
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Lemufex Engineering Group. All rights reserved.
      </div>
    </footer>
  );
}
