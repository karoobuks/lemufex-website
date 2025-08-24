import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactDetails() {
  return (
    <div className="bg-white shadow-md rounded-xl p-8 space-y-4">
      <div className="flex items-start space-x-4">
        <FaMapMarkerAlt className="text-orange-500 text-2xl mt-1" />
        <div>
          <h4 className="font-semibold text-[#002B5B] ">Our Office</h4>
          <p className="text-gray-800">12 Engineering Close, Lagos, Nigeria</p>
        </div>
      </div>
      <div className="flex items-start space-x-4">
        <FaPhone className="text-orange-500 text-2xl mt-1" />
        <div>
          <h4 className="font-semibold text-[#002B5B]">Call Us</h4>
          <p className="text-gray-800">+234 800 000 0000</p>
        </div>
      </div>
      <div className="flex items-start space-x-4">
        <FaEnvelope className="text-orange-500 text-2xl mt-1" />
        <div>
          <h4 className="font-semibold text-[#002B5B]">Email</h4>
          <p className="text-gray-800">info@lemufex.com</p>
        </div>
      </div>
    </div>
  );
}
