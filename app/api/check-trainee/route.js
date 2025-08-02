import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import connectedDB from "@/config/database";
import Trainee from "@/models/Trainee";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response(JSON.stringify({ isTrainee: false }), { status: 401 });
  }

  await connectedDB();
  const trainee = await Trainee.findOne({ user: session.user._id });

  return new Response(JSON.stringify({ isTrainee: !!trainee }), { status: 200 });
}
