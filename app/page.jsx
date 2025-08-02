import { getSessionUser } from '@/utils/getSessionUser';
import HomePage from '@/components/HomePage';

export default async function Page() {
  const currentUser = await getSessionUser(); // This gets the logged-in user

  return <HomePage currentUser={currentUser} />;
}
