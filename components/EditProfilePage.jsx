'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn, signOut, update } from 'next-auth/react';
import { useSession } from "next-auth/react";
import UpdatingProfile from "./loaders/UpdatingProfile";
import { useParams } from "next/navigation";



const EditProfile = ({trainee}) => {
  const {data: session, status} = useSession()
  const params = useParams()
  const userId = session?.user?.id
  const traineeId = params.userId

  console.log(userId) 

    const router = useRouter()
    const [submitting, setSubmitting] = useState(false)
    const [form, setForm] = useState({
        fullName: trainee.fullName ||'',
        phone: trainee.phone || '',
        address: trainee.address || '',
        emergencycontact: trainee.emergencycontact ||  '',
        dob: trainee?.dob ? new Date(trainee.dob).toISOString().split('T')[0] : '',
        image: null,
    })

    const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

     const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true)

    const formData = new FormData();
    formData.append('fullName', form.fullName);
    formData.append('phone', form.phone);
    formData.append('emergencycontact', form.emergencycontact);
    formData.append('address', form.address);
    formData.append('dob', form.dob);
    if (form.image) formData.append('image', form.image);

    const res = await fetch('/api/trainee/update-profile', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
         const result = await res.json();
         console.log('✅ Update result:', result);
         toast.success('Profile updated')
         signIn('credentials')
     window.location.href = `/dashboard/profile`;

    } else {
       const error = await res.json();
       console.error('❌ Update failed:', error);
      toast.error('Update failed');
    }
    setSubmitting(false)
  };



    return ( <section className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit My Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data" >
                <div className="gap-6">
                <label className="text-sm font-medium text-gray-700" htmlFor="fullName">Full Name </label>
                <input type="text"
                name="fullName"
                value={form.fullName}
                required
                 className="mt-1 block w-full text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FE9900]"
                onChange={handleChange}
                 />
                </div>

                <div>
                <label className="text-sm font-medium text-gray-700" htmlFor="phone">Phone</label>
                <input type="tel"
                name="phone"
                value={form.phone}
                required
                 className="mt-1 block w-full text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FE9900]"
                onChange={handleChange}
                 />
                </div>

                <div>
                <label className="text-sm font-medium text-gray-700" htmlFor="emergencycontact">Emergency Contact</label>
                <input type="tel"
                name="emergencycontact"
                value={form.emergencycontact}
                required
                 className="mt-1 block w-full text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FE9900]"
                onChange={handleChange}
                 />
                </div>

                <div>
                <label className="text-sm font-medium text-gray-700" htmlFor="dob">Date of Birth</label>
                <input type="date"
                name="dob"
                value={form.dob}
                required 
                 className="mt-1 block w-full text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FE9900]"
                onChange={handleChange}
                 />
                </div>

                <div>
                <label className="text-sm font-medium text-gray-700" htmlFor="address">Address</label>
                <input type="text"
                name="address"
                value={form.address}
                required
                 className="mt-1 block w-full text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FE9900]"
                onChange={handleChange}
                 />
                </div>

                <div>
                <label className="block  text-gray-900 font-medium" >Profile Image</label>
                 <input 
                 type="file"
                 name="image"
                accept="image/*"  
                onChange={(e) => {
                const file = e.target.files[0];
                if (file && file.size > 2 * 1024 * 1024) {
                toast.error('Image size must be under 2MB');
                return;
              }
              handleChange(e);
            }}
            className="text-gray-500 w-full border border-gray-300 mt-1 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FE9900]" 
                 />
                 </div>

                 <button 
                 type="submit" 
                 disabled={submitting}
                 className="bg-[#FE9900] text-white hover:bg-orange-600 px-4 py-2 rounded-xl">
                  {submitting? <span> <UpdatingProfile className="text-white  font-bold"/></span> : 'Save Changes'}
                 </button>
            </form>
        </section>
    );
}
 
export default EditProfile;