import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function ContactDetails() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#002B5B] mb-6">Get in Touch</h2>
        <p className="text-gray-600 mb-8">
          Ready to start your engineering project? Contact us through any of these channels and we'll respond within 24 hours.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="bg-[#FE9900]/10 p-3 rounded-lg">
            <FaMapMarkerAlt className="text-[#FE9900] text-xl" />
          </div>
          <div>
            <h4 className="font-semibold text-[#002B5B] mb-1">Our Office</h4>
            <p className="text-gray-600">12 Engineering Close, Lagos, Nigeria</p>
            <p className="text-sm text-gray-500 mt-1">Visit us for consultations</p>
          </div>
        </div>

        <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="bg-[#FE9900]/10 p-3 rounded-lg">
            <FaPhone className="text-[#FE9900] text-xl" />
          </div>
          <div>
            <h4 className="font-semibold text-[#002B5B] mb-1">Call Us</h4>
            <p className="text-gray-600">+234 800 000 0000</p>
            <p className="text-sm text-gray-500 mt-1">Mon-Fri, 9AM-6PM WAT</p>
          </div>
        </div>

        <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="bg-[#FE9900]/10 p-3 rounded-lg">
            <FaEnvelope className="text-[#FE9900] text-xl" />
          </div>
          <div>
            <h4 className="font-semibold text-[#002B5B] mb-1">Email Us</h4>
            <p className="text-gray-600">info@lemufex.com</p>
            <p className="text-sm text-gray-500 mt-1">We respond within 24 hours</p>
          </div>
        </div>

        <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="bg-[#FE9900]/10 p-3 rounded-lg">
            <FaClock className="text-[#FE9900] text-xl" />
          </div>
          <div>
            <h4 className="font-semibold text-[#002B5B] mb-1">Business Hours</h4>
            <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
            <p className="text-sm text-gray-500 mt-1">Closed on Sundays</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#002B5B] to-[#1E3A5F] rounded-xl p-6 text-white">
        <h3 className="font-semibold mb-3">Follow Us</h3>
        <div className="flex space-x-4">
          <a href="#" className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors">
            <FaLinkedin className="text-white" />
          </a>
          <a href="#" className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors">
            <FaTwitter className="text-white" />
          </a>
        </div>
      </div>
    </div>
  );
}