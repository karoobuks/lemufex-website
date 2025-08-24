
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EditProfilePage from '@/components/EditProfilePage';
import TypingDots from '@/components/loaders/TypingDots';
import { useSession } from 'next-auth/react';

export default function EditProfilePageWrapper() {
  const [trainee, setTrainee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null)
  const {data:session, status} = useSession()
  const userId = session?.user?.id
  const router = useRouter();

  useEffect(() => {
    async function fetchTrainee() {
      try {
        const res = await fetch(`/api/trainee/${userId}`);
        if (!res.ok) throw new Error('Not authenticated');

        const data = await res.json();
        setTrainee(data);
      } catch (err) {
        router.push('/login'); // redirect if not logged in manually or via google
      } finally {
        setLoading(false);
      }
    }

    fetchTrainee();
  }, [router]);

  //  useEffect(() => {
  //   async function fetchUser() {
  //     try {
  //       const res = await fetch('/api/me');
  //       if (!res.ok) throw new Error('Not authenticated');

  //       const data = await res.json();
  //       setUser(data);
  //     } catch (err) {
  //       router.push('/login'); // redirect if not logged in manually or via google
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchUser();
  // }, [router]);

  if (loading) return <p><TypingDots/></p>;
  if (!trainee) return null;

  return <EditProfilePage trainee={trainee}  />;
}




// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import EditProfilePage from '@/components/EditProfilePage';
// import TypingDots from '@/components/loaders/TypingDots';
// import { useSession } from 'next-auth/react';

// export default function EditProfilePageWrapper() {
//   const [trainee, setTrainee] = useState(null);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const { data: session, status } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     if (status === 'loading') return; // Wait until session is ready
//     if (status === 'unauthenticated') {
//       router.push('/login');
//       return;
//     }

//     async function fetchData() {
//       try {
//         const [userRes, traineeRes] = await Promise.all([
//           fetch('/api/me'),
//           fetch(`/api/trainee/${session.user.id}`)
//         ]);

//         if (!userRes.ok || !traineeRes.ok) throw new Error('Not authenticated');

//         const userData = await userRes.json();
//         const traineeData = await traineeRes.json();

//         setUser(userData);
//         setTrainee(traineeData);
//       } catch (err) {
//         router.push('/login');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, [status, session?.user?.id, router]);

//   if (loading) return <TypingDots />;
//   if (!trainee || !user) return null;

//   return <EditProfilePage trainee={trainee} user={user} />;
// }
