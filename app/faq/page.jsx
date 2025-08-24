// // app/faq/page.jsx
// "use client";
// import { useState } from "react";
// import { ChevronDown } from "lucide-react";

// // const faqs = [
// //   {
// //     category: "General",
// //     items: [
// //       {
// //         q: "What is Lemufex Group?",
// //         a: "Lemufex Group is a training and services company focused on empowering individuals and businesses with digital skills, IT solutions, and professional development programs.",
// //       },
// //       {
// //         q: "Who can benefit from Lemufex trainings?",
// //         a: "Our trainings are open to students, professionals, entrepreneurs, and organizations who want to grow in tech, finance, and business innovation.",
// //       },
// //     ],
// //   },
// //   {
// //     category: "Services & Training",
// //     items: [
// //       {
// //         q: "What kind of trainings do you offer?",
// //         a: "We provide courses in Web Development, Digital Marketing, Cybersecurity, Cloud Computing, Data Analysis, and Corporate IT Solutions.",
// //       },
// //       {
// //         q: "Do you offer certifications?",
// //         a: "Yes, after completing any of our programs, participants receive a Lemufex certification that validates their acquired skills.",
// //       },
// //     ],
// //   },
// //   {
// //     category: "Payment & Billing",
// //     items: [
// //       {
// //         q: "What payment methods do you accept?",
// //         a: "You can pay via bank transfer, debit/credit cards, Paystack, and soon crypto payments will be supported.",
// //       },
// //       {
// //         q: "Can I pay in installments?",
// //         a: "Yes, we allow flexible installment payments for selected training programs. Contact our support for details.",
// //       },
// //     ],
// //   },
// //   {
// //     category: "Support",
// //     items: [
// //       {
// //         q: "How do I contact support?",
// //         a: "You can reach us via email at support@lemufex.com or through the contact form on our website.",
// //       },
// //       {
// //         q: "Do you provide after-training support?",
// //         a: "Absolutely. We provide mentorship, resources, and community access even after the training ends.",
// //       },
// //     ],
// //   },
// // ];

// // export default function FAQPage() {
// //   const [openIndex, setOpenIndex] = useState(null);

// //   const toggle = (index) => {
// //     setOpenIndex(openIndex === index ? null : index);
// //   };

// //   return (
// //     <div className="min-h-screen bg-[#F4F6F8] py-12 px-6">
// //       <div className="max-w-3xl mx-auto">
// //         <h1 className="text-3xl font-bold text-[#003366] mb-8 text-center">
// //           Frequently Asked Questions
// //         </h1>

// //         {faqs.map((section, secIdx) => (
// //           <div key={secIdx} className="mb-10">
// //             <h2 className="text-xl font-semibold text-[#00B894] mb-4">
// //               {section.category}
// //             </h2>

// //             <div className="space-y-4">
// //               {section.items.map((item, idx) => {
// //                 const index = `${secIdx}-${idx}`;
// //                 return (
// //                   <div
// //                     key={index}
// //                     className="bg-white rounded-2xl shadow p-4 cursor-pointer border border-gray-200"
// //                     onClick={() => toggle(index)}
// //                   >
// //                     <div className="flex justify-between items-center">
// //                       <p className="font-medium text-[#1C1C1C]">{item.q}</p>
// //                       <ChevronDown
// //                         className={`w-5 h-5 text-[#F39C12] transition-transform duration-200 ${
// //                           openIndex === index ? "rotate-180" : ""
// //                         }`}
// //                       />
// //                     </div>
// //                     {openIndex === index && (
// //                       <p className="mt-3 text-gray-600 text-sm">{item.a}</p>
// //                     )}
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// export default function FAQ() {
//   const faqs = [
//     {
//       question: "What services does Lemufex Group offer?",
//       answer:
//         "We provide professional IT solutions, including web & mobile app development, digital marketing, cloud hosting, and business automation tailored to enterprises and startups.",
//     },
//     {
//       question: "Does Lemufex Group offer trainings?",
//       answer:
//         "Yes! We train individuals and corporate teams in software development, UI/UX design, cloud computing, cybersecurity, and digital skills needed for the future of work.",
//     },
//     {
//       question: "How can I make payments for services?",
//       answer:
//         "Currently, payments can be made via bank transfer or direct invoice. We are integrating secure online payments soon, so you will be able to pay directly on our website.",
//     },
//     {
//       question: "Can I request a custom project?",
//       answer:
//         "Absolutely. Our team works closely with you to understand your unique requirements and build solutions tailored to your business goals.",
//     },
//     {
//       question: "Do you provide ongoing support after project delivery?",
//       answer:
//         "Yes, Lemufex offers continuous maintenance, updates, and technical support packages to ensure your business runs smoothly.",
//     },
//     {
//       question: "How can I contact Lemufex Group?",
//       answer:
//         "You can reach us through our Contact page, email at support@lemufex.com, or call our support lines. We’re always ready to assist you.",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#0a0f1c] via-[#0e1533] to-[#0a0f1c] text-white px-6 py-16">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-4xl font-bold text-center mb-12 text-[#ffb400]">
//           Frequently Asked Questions
//         </h1>

//         <div className="space-y-6">
//           {faqs.map((faq, idx) => (
//             <details
//               key={idx}
//               className="bg-[#111a2f] border border-[#1f2a44] rounded-2xl p-6 shadow-md hover:shadow-lg transition"
//             >
//               <summary className="cursor-pointer text-lg font-semibold text-[#ffb400] focus:outline-none">
//                 {faq.question}
//               </summary>
//               <p className="mt-4 text-gray-300 leading-relaxed">{faq.answer}</p>
//             </details>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


export default function FAQ() {
  const faqs = [
    {
      question: "What services does Lemufex Group offer?",
      answer:
        "Lemufex Group provides multi-disciplinary engineering and ICT services including Civil & Structural Engineering, Mechanical Systems, Electrical & Power Solutions, Industrial Automation, Plant Commissioning, EPC Projects, ICT & Software Development, Programming, Project Management, and Environmental Engineering.",
    },
    {
      question: "Does Lemufex Group offer trainings?",
      answer:
        "Yes! We provide professional trainings in Automation, Electrical Engineering, and Software Programming. We also organize custom technical workshops, industrial staff training, safety and compliance workshops, and software/engineering system courses.",
    },
    {
      question: "How can I make payments for services or training?",
      answer:
        "Currently, payments can be made via direct bank transfer or invoice. We are integrating secure online payments (cards, Paystack, Flutterwave, and Crypto) so you can pay directly on our website soon.",
    },
    {
      question: "Can I request a custom project?",
      answer:
        "Absolutely! We deliver tailor-made engineering and software projects. Whether you need structural design, automation systems, custom software, or a complete turnkey EPC solution, our team will work with you from concept to completion.",
    },
    {
      question: "Do you provide ongoing support after project delivery?",
      answer:
        "Yes, Lemufex Group provides continuous maintenance, system upgrades, technical support, and consultancy to ensure your projects run smoothly and efficiently.",
    },
    {
      question: "Do you handle sustainable and green engineering projects?",
      answer:
        "Yes. We specialize in renewable energy solutions, sustainable urban infrastructure, green building solutions, and environmental impact assessments (EIA).",
    },
    {
      question: "How can I contact Lemufex Group?",
      answer:
        "You can reach us via our Contact page, email at support@lemufex.com, or call our customer support lines. Our team is always ready to assist you.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1c] via-[#0e1533] to-[#0a0f1c] text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-[#ffb400]">
          Frequently Asked Questions
        </h1>

        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="bg-[#111a2f] border border-[#1f2a44] rounded-2xl p-6 shadow-md hover:shadow-lg transition"
            >
              <summary className="cursor-pointer text-lg font-semibold text-[#ffb400] focus:outline-none">
                {faq.question}
              </summary>
              <p className="mt-4 text-gray-300 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-300 text-lg">
            Still have questions?
          </p>
          <a
            href="/contact"
            className="inline-block mt-4 px-6 py-3 bg-[#ffb400] text-black font-semibold rounded-xl shadow-md hover:bg-[#e6a200] transition"
          >
            Contact Us →
          </a>
        </div>
      </div>
    </div>
  );
}
