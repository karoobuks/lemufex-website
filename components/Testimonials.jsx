'use client';

const testimonials = [
  {
    name: 'Engr. Michael Adeyemi',
    position: 'Project Manager, NovaConstruct',
    comment:
      'Lemufex delivered our structural steel project ahead of schedule and with unmatched quality. Their team was professional and solution-focused.',
  },
  {
    name: 'Ms. Ifeoma Okeke',
    position: 'Facilities Coordinator, Chevron Nigeria',
    comment:
      'The HVAC system they integrated for our office has reduced our energy costs significantly. Excellent job!',
  },
  {
    name: 'Engr. Umar Bashir',
    position: 'Head of Operations, GreenGrid Power',
    comment:
      'We’ve partnered with Lemufex for several electrical installations, and they consistently exceed expectations. Highly recommended.',
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">What Our Clients Say</h2>
        <div className="grid gap-10 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-xl p-6 shadow hover:shadow-md transition"
            >
              <p className="text-sm text-gray-700 italic mb-4">“{t.comment}”</p>
              <h4 className="font-semibold text-gray-800">{t.name}</h4>
              <p className="text-xs text-gray-500">{t.position}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
