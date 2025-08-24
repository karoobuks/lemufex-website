const values = [
  { title: 'Integrity', desc: 'We act with honesty, fairness, and accountability.' },
  { title: 'Innovation', desc: 'We embrace change and pioneer new solutions.' },
  { title: 'Excellence', desc: 'We deliver with quality, precision, and passion.' },
  { title: 'Collaboration', desc: 'We succeed through teamwork and partnerships.' },
];

export default function OurValues() {
  return (
    <section className="py-16 bg-gray-100 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Our Core Values</h2>
        <div className="grid md:grid-cols-2 gap-8 text-left">
          {values.map((val, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-semibold text-[#FE9900] mb-2">{val.title}</h3>
              <p>{val.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
