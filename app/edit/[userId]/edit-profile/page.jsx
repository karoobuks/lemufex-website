'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EditProfilePage from '@/components/EditProfilePage';
import TypingDots from '@/components/loaders/TypingDots';
import { useSession } from 'next-auth/react';

export default function EditProfilePageWrapper() {
  const [trainee, setTrainee] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();
  const userId = session?.user?.id;

  useEffect(() => {
    // 🧠 Wait until session is known
    if (status === 'loading') return;

    // 🧩 If user is not authenticated
    if (status === 'unauthenticated' || !userId) {
      router.push('/login');
      return;
    }

    async function fetchTrainee() {
      try {
        const res = await fetch(`/api/trainee/${userId}`);
        const json = await res.json();

        if (!res.ok || !json.data) {
          throw new Error(json.error || 'Failed to fetch trainee');
        }

        setTrainee(json.data);
      } catch (err) {
        console.error('Error fetching trainee:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    fetchTrainee();
  }, [status, userId, router]);

  if (status === 'loading' || loading) return <TypingDots />;
  if (!trainee) return null;

  return <EditProfilePage trainee={trainee} />;
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
