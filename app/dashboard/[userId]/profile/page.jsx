// 'use client'
// import ProfileHeader from "@/components/trainee-profile/ProfileHeader" 
// import PersonalInfo from "@/components/trainee-profile/PersonalInfo"
// import TrainingProgress from "@/components/trainee-profile/TrainingProgress"
// import AccountDetails from "@/components/trainee-profile/AccountDetails" 
// import DocumentsSection from "@/components/trainee-profile/DocumentSection"
// import SupportSection from "@/components/trainee-profile/SupportSection"
// import { useSession } from "next-auth/react"
// import { useState, useEffect } from "react"

// export default function ProfilePage({params}) {
//     const [trainee, setTrainee] = useState({})
//     const { data: session, status } = useSession();
//     const userId = session?.user?.id
    

//       useEffect(() => {
//     const fetchTrainee = async () => {
//       if (!userId) return;

//       const res = await fetch(`/api/trainee/${userId}`);
//       const json = await res.json();
//       setTrainee(json.data);
//     };

//     console.log('Trainee:', trainee)
    
//     fetchTrainee();
//   }, [userId]);



// //   const [user, setUser] = useState(null);

// // useEffect(() => {
// //   const fetchUser = async () => {
// //     if (!userId) return;
// //     const res = await fetch(`/api/user/${params.userId}`);
// //     const json = await res.json();
// //     setUser(json.data);
// //   };
// //   fetchUser();
// // }, [params.userId]);





//    const userInfo = {
//     name: trainee?.fullName || '',
//     imageUrl: trainee?.image || '',
//     email: trainee?.email || '',
//     phone: trainee?.phone || '',
//     address: trainee?.address || '',
//     course: trainee?.course || '',
//     documents: trainee?.documents || [],
//     dob: trainee?.dob? new Date(trainee.dob).toLocaleDateString() : '',
//     emergencyContact: trainee?.emergencycontact || '',
//   };

     

//  const accountInfo = {
//     username: trainee?.userName || session?.user?.firstName ||  '',
//     createdAt: trainee?.createdAt ? new Date (trainee.createdAt).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     }) : '',
//     status: trainee?.status || 'Active',
//   };




//   return (
//     <main className=" mx-auto p-6  bg-gray-50 min-h-screen">
//       <ProfileHeader name={userInfo.name} imageUrl={userInfo.imageUrl} />
//       <PersonalInfo info={userInfo} />
//       <AccountDetails details={accountInfo}  />
//       <DocumentsSection documents={userInfo.documents} />
//       <SupportSection />
//     </main>
//   );
// }



'use client'
import ProfileHeader from "@/components/trainee-profile/ProfileHeader" 
import PersonalInfo from "@/components/trainee-profile/PersonalInfo"
import TrainingProgress from "@/components/trainee-profile/TrainingProgress"
import AccountDetails from "@/components/trainee-profile/AccountDetails" 
import DocumentsSection from "@/components/trainee-profile/DocumentSection"
import SupportSection from "@/components/trainee-profile/SupportSection"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

export default function ProfilePage({ params }) {
  const [trainee, setTrainee] = useState({})
  const [me, setMe] = useState(null) // 👈 store /api/me response
  const { data: session } = useSession()
  const userId = session?.user?.id

  useEffect(() => {
    const fetchTrainee = async () => {
      if (!userId) return;
      const res = await fetch(`/api/trainee/${userId}`);
      const json = await res.json();
      setTrainee(json.data);
    };

    const fetchMe = async () => {
      const res = await fetch(`/api/me`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setMe(json);
      }
    };

    fetchTrainee();
    fetchMe();
  }, [userId]);

  const userInfo = {
    name: trainee?.fullName || '',
    imageUrl: trainee?.image || '',
    email: trainee?.email || '',
    phone: trainee?.phone || '',
    address: trainee?.address || '',
    course: trainee?.course || '',
    documents: trainee?.documents || [],
    dob: trainee?.dob ? new Date(trainee.dob).toLocaleDateString() : '',
    emergencyContact: trainee?.emergencycontact || '',
  };

  const accountInfo = {
    username: trainee?.userName || session?.user?.firstName ||  '',
    createdAt: trainee?.createdAt
      ? new Date(trainee.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '',
    status: trainee?.status || 'Active',
    hasPassword: me?.hasPassword ?? false, // 👈 add it here
  };

  return (
    <main className="mx-auto p-6 bg-gray-50 min-h-screen">
      <ProfileHeader name={userInfo.name} imageUrl={userInfo.imageUrl} />
      <PersonalInfo info={userInfo} />
      {/* ✅ Pass hasPassword down */}
      <AccountDetails details={accountInfo} />
      <DocumentsSection documents={userInfo.documents} />
      <SupportSection />
    </main>
  );
}
