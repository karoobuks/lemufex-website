const ContactMap = () => (
  <section className="py-16">
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#002B5B] mb-4">Find Us</h2>
        <p className="text-gray-600">
          Located in the heart of Lagos, we're easily accessible for consultations and meetings.
        </p>
      </div>
      <div className="w-full h-96 rounded-2xl overflow-hidden shadow-lg">
        <iframe
          className="w-full h-full"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.841275550202!2d3.350084!3d6.524379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf48c16d28a99%3A0x7eaa7edb6179f9aa!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sng!4v1689023456789"
        ></iframe>
      </div>
    </div>
  </section>
);

export default ContactMap;