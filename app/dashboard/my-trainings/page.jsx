'use client'
import TrainingProgress from "@/components/trainee-profile/TrainingProgress";
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"


 

const MyTrainings = () => {


       const [trainee, setTrainee] = useState({})
    const { data: session, status } = useSession();
    const userId = session?.user?.id

      useEffect(() => {
    const fetchTrainee = async () => {
      if (!userId) return;

      const res = await fetch(`/api/trainee/${userId}`);
      const json = await res.json();
      setTrainee(json.data);
    };

    console.log('Trainee:', trainee)
    
    fetchTrainee();
  }, [userId]);


   const userInfo = {
    name: trainee?.fullName || '',
    imageUrl: trainee?.image || '',
    email: trainee?.email || '',
    phone: trainee?.phone || '',
    address: trainee?.address || '',
    course: trainee?.course || '',
    documents: trainee?.documents || [],
    dob: trainee?.dob || '',
    emergencyContact: trainee?.emergencycontact || '',
  };



    return ( 
        <TrainingProgress courses={userInfo.course} />
     );
}
 
export default MyTrainings;