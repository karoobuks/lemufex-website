import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import connectedDB from "@/config/database";
import Trainee from "@/models/Trainee";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response(JSON.stringify({ exists: false }), { status: 401 });
  }

  await connectedDB();

    const userId = session.user._id || session.user.id;
  if (!userId) {
    console.log("⚠️ No user ID found in session");
    return new Response(JSON.stringify({ exists: false }), { status: 400 });
  }

  const trainee = await Trainee.findOne({  userId });
 

  return new Response(JSON.stringify({ exists: !!trainee }), { status: 200 });
}
