'use client';
import { useState } from "react";
import TypingDots from "./loaders/TypingDots";

export default function ContactFormData() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setStatus(data.msg);
    } catch (err) {
      setStatus("Something went wrong");
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl  p-8 space-y-6">
      <input
        type="text"
        name="name"
        value={formData.name}
        placeholder="Your Name"
        onChange={handleChange}
        className="w-full border border-gray-900 px-4 py-3 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FE9900]"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        placeholder="Your Email"
        onChange={handleChange}
        className="w-full border border-gray-900 px-4 py-3 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FE9900]"
        required
      />
      <textarea
        name="message"
        rows={5}
        value={formData.message}
        placeholder="Your Message"
        onChange={handleChange}
        className="w-full border border-gray-900 px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FE9900]"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-orange-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-orange-600 transition"
      >
      {loading ? <TypingDots/> : "Send Message"}
      </button>

      {status && <p className="mt-2 text-red-600">{status}</p>}
      
    </form>
  );
}
