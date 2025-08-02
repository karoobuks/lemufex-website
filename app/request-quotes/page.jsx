// 'use client';
// import { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
// import toast from 'react-hot-toast';

// const RequestQuote = () => {
//   const searchParams = useSearchParams()
//   const selectedTitle = searchParams.get('title')
//   const itemListRaw = searchParams.get('items')
//   // const itemList = itemListRaw ? JSON.parse(itemListRaw) : [];
//  const [itemList, setItemList] = useState([]);

//   useEffect(() => {
//     const raw = searchParams.get('items');
//     if (raw) {
//       try {
//         const decoded = decodeURIComponent(raw);
//         const parsed = JSON.parse(decoded);
//         if (Array.isArray(parsed)) {
//           setItemList(parsed);
//         }
//       } catch (error) {
//         console.error('Failed to parse items:', error);
//       }
//     }
//   }, [searchParams]);



//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     service: selectedTitle || '',
//     message: '',
//     file: null,
//     options: [],
//   });

// //   const handleChange = (e) => {
// //     const { name, value, files, types, checked } = e.target;
// //     if(name === 'options'){
// //     setForm((prev) => {
// //       const updated = checked
// //       ? [...prev.options, value]
// //       : prev.options.filter((item) => item !== value);
// //       return {...prev, options: updated};
// //     });
// //   } else{
// //     setForm((prev) =>({
// //       ...prev,
// //       [name]: files ? files[0] : value,
// //     }))
// //   }
// // }

// const handleChange = (e) => {
//   const { name, value, files } = e.target;

//   if (name === 'options') {
//     // only one option selected from dropdown
//     setForm((prev) => ({
//       ...prev,
//       options: [value], // still an array for backend compatibility
//     }));
//   } else {
//     setForm((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value,
//     }));
//   }
// };


//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   const formData = new FormData();
//   formData.append('name', form.name);
//   formData.append('email', form.email);
//   formData.append('phone', form.phone);
//   formData.append('service', form.service);
//   formData.append('message', form.message);
//   formData.append('options', form.options.join(', '))
//   if (form.file) {
//     formData.append('file', form.file);
//   }

//   try {
//     const res = await fetch('/api/request-quotes', {
//       method: 'POST',
//       body: formData,
//     });

//     const result = await res.json();
//     if (result.success) {
//       toast.success('Quote request submitted successfully!');
//     } else {
//       toast.error('Submission failed.');
//     }
//   } catch (err) {
//     console.error(err);
//     toast.error('An error occurred while submitting.');
//   }
// };


//   return (
//     <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto bg-[#FE9900] text-white p-8 rounded-2xl shadow-lg">
//         <h2 className="text-3xl font-bold mb-4 text-center">Request a Quote</h2>
//         <p className="mb-8 text-center">Get a tailored estimate for your project.</p>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <input
//               type="text"
//               name="name"
//               onChange={handleChange}
//               placeholder="Your Full Name"
//               required
//               className="p-3 rounded-md bg-white text-black placeholder-gray-500"
//             />
//             <input
//               type="email"
//               name="email"
//               onChange={handleChange}
//               placeholder="Email Address"
//               required
//               className="p-3 rounded-md bg-white text-black placeholder-gray-500"
//             />
//             <input
//               type="tel"
//               name="phone"
//               onChange={handleChange}
//               placeholder="Phone Number"
//               required
//               className="p-3 rounded-md bg-white text-black placeholder-gray-500"
//             />
//             <input
//               type="text"
//               name="service"
//               value={form.service}
//               readOnly
//               className="p-3 rounded-md bg-gray-100 text-black"
//             />
//             {/* <select
//               name="service"
//               onChange={handleChange}
//               required
//               className="p-3 rounded-md bg-white text-black"
//             >
//               <option value="">Select a Service</option>
//               <option value="civil">Civil & Structural Engineering</option>
//               <option value="mechanical">Mechanical Engineering</option>
//               <option value="electrical">Electrical & Solar Installation</option>
//               <option value="ict">ICT/Networking</option>
//               <option value="others">Others</option>
//             </select> */}
//             </div>
//             {/* {itemList.length > 0 && (
//             <div>
//               <p className="mb-2 text-sm text-white font-semibold">Select Specific Needs:</p>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                 {itemList.map((item, i) => (
//                   <label key={i} className="flex items-center space-x-2 bg-white text-black p-2 rounded">
//                     <input
//                       type="checkbox"
//                       name="options"
//                       value={item}
//                       onChange={handleChange}
//                     />
//                     <span>{item}</span>
//                   </label>
                  
//                 ))}
//             </div>
//            </div>
//           )} */}


//             {itemList.length > 0 && (
//             <div>
//               <label className="block mb-2 text-sm text-white font-semibold">
//                 Select Specific Need:
//               </label>
//               <select
//                 name="options"
//                 onChange={handleChange}
//                 className="w-full p-3 rounded-md bg-white text-black"
//                 required
//               >
//                 <option value="">-- Choose an Option --</option>
//                 {itemList.map((item, i) => (
//                   <option key={i} value={item}>
//                     {item}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}

//           {itemList.length === 0 && (
//             <p className="text-sm text-red-200">No dropdown options found. Check URL parameters.</p>
//           )}

//           <textarea
//             name="message"
//             rows="4"
//             onChange={handleChange}
//             placeholder="Describe your project..."
//             className="w-full p-3 rounded-md bg-white text-black placeholder-gray-500"
//           ></textarea>

//           <div className="flex flex-col sm:flex-row items-start gap-4">
//             <input
//               type="file"
//               name="file"
//               onChange={handleChange}
//               className="bg-white text-black rounded-md p-2"
//             />
//             <button
//               type="submit"
//               className="bg-black text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition"
//             >
//               Submit Request
//             </button>
//           </div>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default RequestQuote;


'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

const RequestQuote = () => {
  const searchParams = useSearchParams();
  const selectedTitle = searchParams.get('title') || '';
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    const raw = searchParams.get('items');
    if (raw) {
      try {
        const decoded = decodeURIComponent(raw);
        const parsed = JSON.parse(decoded);; // No need to decodeURIComponent, already decoded by `useSearchParams`
        if (Array.isArray(parsed)) {
          setItemList(parsed);
        }
      } catch (error) {
        console.error('Failed to parse items:', error);
      }
    }
  }, [searchParams]);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: selectedTitle,
    message: '',
    file: null,
    options: [],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'options') {
      setForm((prev) => ({
        ...prev,
        options: [value],
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('phone', form.phone);
    formData.append('service', form.service);
    formData.append('message', form.message);
    formData.append('options', form.options.join(', '));
    if (form.file) {
      formData.append('file', form.file);
    }

    try {
      const res = await fetch('/api/request-quotes', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        toast.success('Quote request submitted successfully!');
      } else {
        toast.error('Submission failed.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while submitting.');
    }
  };

  return (
    <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-[#FE9900] text-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-center">Request a Quote</h2>
        <p className="mb-8 text-center">Get a tailored estimate for your project.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              onChange={handleChange}
              placeholder="Your Full Name"
              required
              className="p-3 rounded-md bg-white text-black placeholder-gray-500"
            />
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="p-3 rounded-md bg-white text-black placeholder-gray-500"
            />
            <input
              type="tel"
              name="phone"
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="p-3 rounded-md bg-white text-black placeholder-gray-500"
            />
            <input
              type="text"
              name="service"
              value={form.service}
              readOnly
              className="p-3 rounded-md bg-gray-100 text-black"
            />
          </div>

          {itemList.length > 0 ? (
            <div>
              <label className="block mb-2 text-sm text-white font-semibold">
                Select Specific Need:
              </label>
              <select
                name="options"
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-white text-black"
                required
              >
                <option value="">-- Choose an Option --</option>
                {itemList.map((item, i) => (
                  <option key={i} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-sm text-red-200">
              No dropdown options found. Check URL parameters.
            </p>
          )}

          <textarea
            name="message"
            rows="4"
            onChange={handleChange}
            placeholder="Describe your project..."
            className="w-full p-3 rounded-md bg-white text-black placeholder-gray-500"
          ></textarea>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <input
              type="file"
              name="file"
              onChange={handleChange}
              className="bg-white text-black rounded-md p-2"
            />
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default RequestQuote;
